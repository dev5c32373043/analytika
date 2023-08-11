import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Line } from 'react-chartjs-2';
import { CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Chart } from 'chart.js';

import { fetchReport } from './insights-chart.slice';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const skipped = (ctx, value) => (ctx.p0.skip || ctx.p1.skip ? value : undefined);
const down = (ctx, value) => (ctx.p0.parsed.y > ctx.p1.parsed.y ? value : undefined);

export function InsightsChart() {
  const insightsChart = useSelector(state => state.insightsChart);
  const dispatch = useDispatch();

  const datasetBasicConfig = {
    borderColor: 'rgb(75, 192, 192)',
    backgroundColor: 'rgb(75, 192, 192)',
    segment: {
      borderColor(ctx) {
        return skipped(ctx, 'rgb(0,0,0,0.2)') || down(ctx, 'rgb(192,75,75)');
      },
      borderDash: ctx => skipped(ctx, [6, 6]),
    },
    spanGaps: true,
  };

  const [data, setData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    if (insightsChart.loading === 'idle') {
      dispatch(fetchReport({}, datasetBasicConfig));
      return;
    }

    if (insightsChart.loading === 'succeeded') {
      setData({
        ...insightsChart.data,
        datasets: insightsChart.data.datasets.map(d => ({ ...datasetBasicConfig, ...d })),
      });
    }
  }, [insightsChart.loading]);

  const options = {
    responsive: true,
    fill: false,
    interaction: {
      intersect: false,
    },
    radius: 0,
  };

  return (
    <div id="activity-timeline-chart" className="w-2/4">
      <Line options={options} data={data} />
    </div>
  );
}

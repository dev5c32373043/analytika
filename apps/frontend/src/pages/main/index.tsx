import { InsightsChart } from './insights-chart';
import { ActivityList } from './activity-list';
import { MainLayout } from '../../components';

export function MainPage() {
  return (
    <MainLayout>
      <InsightsChart />
      <ActivityList />
    </MainLayout>
  );
}

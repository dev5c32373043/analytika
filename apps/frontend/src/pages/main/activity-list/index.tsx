import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { fetchActivities, loadMore } from './activities.slice';
import { fetchReport } from '../insights-chart/insights-chart.slice';

import { activitiesService } from '../../../services';

import { Autocomplete, Loader } from '../../../components';
import { getInitials } from '../../../utils';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export function ActivityList() {
  const activities = useSelector(state => state.activities);
  const dispatch = useDispatch();

  useEffect(() => {
    if (activities.loading !== 'idle') return;
    dispatch(fetchActivities({ order: '$desc', $limit: activities.limit }));
  });

  function onActivitySelect(item) {
    const baseQuery: { action?: string } = {};

    if (item?.action != null) {
      baseQuery.action = item.action;
    }

    dispatch(fetchReport(baseQuery));
    dispatch(fetchActivities({ ...baseQuery, order: '$desc', $limit: activities.limit }));
  }

  async function onActivitySearch(searchTxt: string) {
    return activitiesService.list({ search: searchTxt, $limit: 15 });
  }

  function fetchMore() {
    if (activities.loading !== 'succeeded') return;

    const $token = activities.records.at(-1).timeid;
    dispatch(loadMore({ $token, order: '$desc', $limit: activities.limit }));
  }

  if (activities.loading === 'pending' && activities.records.length === 0) {
    return <Loader />;
  }

  if (activities.loading === 'succeeded' && activities.records.length === 0) {
    return (
      <div id="empty-activity-feed" className="w-2/4">
        <p className="text-2xl my-8 text-center text-slate-500">
          Let's get things moving! Your customers activities seem to be taking a break. Time to give them some attention
          and spice up the activity feed!
          <span role="img" aria-label="no activity">
            🔥📢
          </span>
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="w-2/4 pt-12">
        <Autocomplete
          placeholder="Filter by activity"
          label="action"
          minInputLength={2}
          onSearch={onActivitySearch}
          onSelect={onActivitySelect}
        />
      </div>

      <ul
        id="activity-feed"
        aria-label="User activity feed"
        role="feed"
        className="relative flex flex-col w-2/4 gap-12 py-12 pl-8 before:absolute before:top-0 before:left-8 before:h-full before:-translate-x-1/2 before:border before:border-dashed before:border-slate-200 after:absolute after:top-6 after:left-8 after:bottom-6 after:-translate-x-1/2 after:border after:border-slate-200 "
      >
        {activities.records.map(activity => (
          <li className="relative pl-8" key={activity.id}>
            <div className="flex flex-col flex-1 gap-4">
              <div className="absolute z-10 inline-flex items-center justify-center w-8 h-8 text-white rounded-full -left-4 ring-2 ring-white bg-emerald-500">
                <span className="text-xs uppercase">{getInitials(activity.username)}</span>
              </div>
              <h4 className="flex flex-col items-start text-lg font-medium leading-8 text-slate-700 md:flex-row lg:items-center">
                <span className="flex-1">
                  {activity.username}
                  <span className="text-base font-normal"> performed </span>
                  <span className="text-base font-normal text-slate-500">{activity.action}</span>
                </span>
                <span className="text-sm font-normal text-slate-400"> {dayjs(activity.time).fromNow()}</span>
              </h4>
              <p className=" text-slate-500"></p>
            </div>
          </li>
        ))}
      </ul>
      {activities.moreToLoad && (
        <button
          onClick={fetchMore}
          className="inline-flex h-8 mb-4 items-center justify-center gap-2 justify-self-center whitespace-nowrap rounded-full bg-emerald-50 px-4 text-xs font-medium tracking-wide text-emerald-500 transition duration-300 hover:bg-emerald-100 hover:text-emerald-600 focus:bg-emerald-200 focus:text-emerald-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-100 disabled:text-emerald-400 disabled:shadow-none"
        >
          <span>Load more</span>
          <span className="relative only:-mx-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 16 16"
              stroke="currentColor"
              role="graphics-symbol"
              aria-labelledby="title-load-more"
            >
              <title id="title-load-more">Load more activities</title>
              <path
                fillRule="evenodd"
                d="M1 3.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5zM8 6a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 .708-.708L7.5 12.293V6.5A.5.5 0 0 1 8 6z"
              />
            </svg>
          </span>
        </button>
      )}
    </>
  );
}

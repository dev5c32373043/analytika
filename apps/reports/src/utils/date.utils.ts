import dayjs from 'dayjs';

export function getDateRange(startDate: Date, endDate: Date, format: string): string[] {
  const range = [];

  let from = dayjs(startDate);
  const to = dayjs(endDate);

  if (from.isAfter(to)) {
    throw new Error("startDate can't be after endDate!");
  }

  while (!from.isSame(to, 'day')) {
    const date = from.format(format);
    range.push(date);
    from = from.add(1, 'day');
  }

  return range;
}

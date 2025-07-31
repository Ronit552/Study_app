import { format, toZonedTime } from 'date-fns-tz';
import { addDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

const IST_TIMEZONE = 'Asia/Kolkata';

export const getIstDate = (date: Date = new Date()): string => {
  const zonedDate = toZonedTime(date, IST_TIMEZONE);
  return format(zonedDate, 'yyyy-MM-dd', { timeZone: IST_TIMEZONE });
};

export const formatDuration = (totalSeconds: number): string => {
  if (totalSeconds < 0) totalSeconds = 0;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const paddedHours = String(hours).padStart(2, '0');
  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(seconds).padStart(2, '0');

  return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
};

export const getTodayInIst = (): string => {
    return getIstDate(new Date());
};

export const getPastDates = (days: number): string[] => {
    const today = getTodayInIst();
    const dates = [];
    for (let i = 0; i < days; i++) {
        const date = addDays(new Date(today), -i);
        dates.push(getIstDate(date));
    }
    return dates.reverse();
};

export const getDatesForCurrentMonth = (): string[] => {
    const today = new Date();
    const zonedToday = toZonedTime(today, IST_TIMEZONE);
    const start = startOfMonth(zonedToday);
    const end = endOfMonth(zonedToday);
    const dates = eachDayOfInterval({ start, end });
    return dates.map(date => getIstDate(date));
};
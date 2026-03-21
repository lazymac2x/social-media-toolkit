/**
 * Best posting times module — rule-based scheduling data.
 */

// Best posting times in UTC (hour 0-23). Based on aggregated social media research.
const BEST_TIMES = {
  instagram: {
    monday:    { best: [11, 14], good: [7, 8, 16, 17] },
    tuesday:   { best: [10, 13], good: [7, 9, 15, 18] },
    wednesday: { best: [11, 14], good: [7, 8, 17, 19] },
    thursday:  { best: [11, 12, 14], good: [7, 9, 16] },
    friday:    { best: [10, 11], good: [7, 14, 15] },
    saturday:  { best: [9, 11], good: [8, 13, 16] },
    sunday:    { best: [10, 14], good: [7, 11, 17] }
  },
  twitter: {
    monday:    { best: [8, 12], good: [10, 15, 17] },
    tuesday:   { best: [9, 13], good: [8, 11, 16] },
    wednesday: { best: [9, 12], good: [7, 15, 18] },
    thursday:  { best: [9, 12, 14], good: [7, 11, 16] },
    friday:    { best: [9, 11], good: [7, 13, 14] },
    saturday:  { best: [8, 10], good: [9, 12, 14] },
    sunday:    { best: [9, 12], good: [8, 14, 16] }
  },
  tiktok: {
    monday:    { best: [6, 10, 22], good: [12, 15, 19] },
    tuesday:   { best: [9, 12, 19], good: [7, 15, 21] },
    wednesday: { best: [7, 11, 20], good: [8, 13, 22] },
    thursday:  { best: [9, 12, 19], good: [7, 15, 21] },
    friday:    { best: [5, 13, 19], good: [9, 15, 21] },
    saturday:  { best: [11, 19, 21], good: [8, 14, 16] },
    sunday:    { best: [7, 10, 19], good: [8, 14, 22] }
  },
  linkedin: {
    monday:    { best: [7, 10, 12], good: [8, 14, 17] },
    tuesday:   { best: [7, 10, 12], good: [8, 11, 17] },
    wednesday: { best: [7, 10, 12], good: [8, 9, 14] },
    thursday:  { best: [7, 10, 12], good: [8, 14, 16] },
    friday:    { best: [7, 10], good: [8, 12, 14] },
    saturday:  { best: [10, 12], good: [9, 11] },
    sunday:    { best: [10, 12], good: [9, 14] }
  },
  facebook: {
    monday:    { best: [9, 12], good: [8, 13, 16] },
    tuesday:   { best: [9, 12, 14], good: [8, 15, 17] },
    wednesday: { best: [9, 11, 13], good: [8, 12, 15] },
    thursday:  { best: [9, 12, 14], good: [8, 11, 16] },
    friday:    { best: [9, 11], good: [8, 13, 15] },
    saturday:  { best: [10, 12], good: [9, 14, 16] },
    sunday:    { best: [10, 13], good: [9, 12, 15] }
  },
  youtube: {
    monday:    { best: [14, 16], good: [12, 15, 18] },
    tuesday:   { best: [14, 16], good: [12, 15, 18] },
    wednesday: { best: [14, 16], good: [12, 15, 18] },
    thursday:  { best: [12, 15, 18], good: [14, 16, 20] },
    friday:    { best: [12, 15], good: [14, 16, 18] },
    saturday:  { best: [9, 11], good: [10, 14, 16] },
    sunday:    { best: [9, 11], good: [10, 14, 16] }
  },
  pinterest: {
    monday:    { best: [14, 20], good: [12, 16, 21] },
    tuesday:   { best: [14, 20], good: [12, 16, 21] },
    wednesday: { best: [14, 20], good: [12, 15, 21] },
    thursday:  { best: [14, 20], good: [12, 16, 21] },
    friday:    { best: [14, 20], good: [12, 15, 17] },
    saturday:  { best: [20, 22], good: [14, 16, 21] },
    sunday:    { best: [20, 22], good: [14, 16, 21] }
  }
};

const TIMEZONE_OFFSETS = {
  'US/Eastern': -5,
  'US/Central': -6,
  'US/Mountain': -7,
  'US/Pacific': -8,
  'Europe/London': 0,
  'Europe/Paris': 1,
  'Europe/Berlin': 1,
  'Asia/Tokyo': 9,
  'Asia/Seoul': 9,
  'Asia/Shanghai': 8,
  'Asia/Singapore': 8,
  'Asia/Dubai': 4,
  'Asia/Kolkata': 5.5,
  'Australia/Sydney': 11,
  'Pacific/Auckland': 13,
  'America/Sao_Paulo': -3,
  'UTC': 0
};

const DAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

/**
 * Convert UTC hour to local hour.
 */
function utcToLocal(utcHour, timezoneOffset) {
  let local = (utcHour + timezoneOffset) % 24;
  if (local < 0) local += 24;
  return local;
}

function formatHour(h) {
  const period = h >= 12 ? 'PM' : 'AM';
  const display = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${display}:00 ${period}`;
}

/**
 * Get best posting times for a platform.
 */
function getBestTimes(platform, options = {}) {
  const {
    timezone = 'UTC',
    day
  } = options;

  const platformKey = platform.toLowerCase();
  const schedule = BEST_TIMES[platformKey];

  if (!schedule) {
    return {
      error: `Platform "${platform}" not supported`,
      supported_platforms: Object.keys(BEST_TIMES)
    };
  }

  const offset = TIMEZONE_OFFSETS[timezone] ?? 0;

  if (day) {
    const dayKey = day.toLowerCase();
    const daySchedule = schedule[dayKey];
    if (!daySchedule) {
      return { error: `Invalid day: ${day}`, valid_days: DAY_NAMES };
    }

    return {
      platform: platformKey,
      timezone,
      day: dayKey,
      best_times: daySchedule.best.map(h => ({
        utc: formatHour(h),
        local: formatHour(utcToLocal(h, offset))
      })),
      good_times: daySchedule.good.map(h => ({
        utc: formatHour(h),
        local: formatHour(utcToLocal(h, offset))
      }))
    };
  }

  // Return full week
  const weekSchedule = {};
  for (const [dayName, times] of Object.entries(schedule)) {
    weekSchedule[dayName] = {
      best_times: times.best.map(h => ({
        utc: formatHour(h),
        local: formatHour(utcToLocal(h, offset))
      })),
      good_times: times.good.map(h => ({
        utc: formatHour(h),
        local: formatHour(utcToLocal(h, offset))
      }))
    };
  }

  return {
    platform: platformKey,
    timezone,
    schedule: weekSchedule,
    supported_timezones: Object.keys(TIMEZONE_OFFSETS)
  };
}

/**
 * Get the next optimal posting time from now.
 */
function getNextBestTime(platform, options = {}) {
  const { timezone = 'UTC' } = options;
  const platformKey = platform.toLowerCase();
  const schedule = BEST_TIMES[platformKey];

  if (!schedule) {
    return { error: `Platform "${platform}" not supported` };
  }

  const offset = TIMEZONE_OFFSETS[timezone] ?? 0;
  const now = new Date();
  const utcHour = now.getUTCHours();
  const utcDay = now.getUTCDay();

  // Search up to 7 days ahead
  for (let daysAhead = 0; daysAhead < 7; daysAhead++) {
    const checkDay = (utcDay + daysAhead) % 7;
    const dayName = DAY_NAMES[checkDay];
    const daySchedule = schedule[dayName];

    if (!daySchedule) continue;

    const bestHours = [...daySchedule.best].sort((a, b) => a - b);
    for (const hour of bestHours) {
      if (daysAhead === 0 && hour <= utcHour) continue;
      return {
        platform: platformKey,
        timezone,
        next_best_time: {
          day: dayName,
          utc: formatHour(hour),
          local: formatHour(utcToLocal(hour, offset)),
          hours_from_now: daysAhead * 24 + (hour - utcHour)
        }
      };
    }
  }

  return { platform: platformKey, message: 'No upcoming best times found within a week.' };
}

module.exports = { getBestTimes, getNextBestTime, BEST_TIMES, TIMEZONE_OFFSETS };

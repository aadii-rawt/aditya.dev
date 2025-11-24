import React, { useEffect, useState } from 'react';

const githubConfig = {
  username: 'aadii-rawt',
  apiUrl: 'https://github-contributions-api.deno.dev',

  // Display settings
  title: 'GitHub Activity',
  subtitle: 'coding journey over the past year',

  // Chart settings
  blockSize: 9,
  blockMargin: 3,
  fontSize: 12,
  maxLevel: 4,

  // Month labels
  months: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],

  // Weekday labels (empty for weekends, M for Monday, etc.)
  weekdays: ['', 'M', '', 'W', '', 'F', ''],

  // Total count label template
  totalCountLabel: '{{count}} contributions in the last year',

  // Theme configuration for dark and light modes
  theme: {
    dark: [
      'rgb(22, 27, 34)', // Very dark for no contributions
      'rgb(14, 68, 41)', // Dark green
      'rgb(0, 109, 50)', // Medium green
      'rgb(38, 166, 65)', // Bright green
      'rgb(57, 211, 83)', // Very bright green
    ],
    light: [
      'rgb(235, 237, 240)', // Light gray
      'rgb(155, 233, 168)', // Light green
      'rgb(64, 196, 99)', // Medium green
      'rgb(48, 161, 78)', // Dark green
      'rgb(33, 110, 57)', // Very dark green
    ],
  },

  // Error state configuration
  errorState: {
    title: 'Unable to load GitHub contributions',
    description: 'Check out my profile directly for the latest activity',
    buttonText: 'View on GitHub',
  },

  // Loading state configuration
  loadingState: {
    title: 'Loading contributions...',
    description: 'Fetching your GitHub activity data',
  },
};

const GithubIcon = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M12 .5a12 12 0 00-3.79 23.4c.6.11.82-.26.82-.58v-2.1c-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.34-1.77-1.34-1.77-1.09-.75.08-.74.08-.74 1.2.09 1.84 1.23 1.84 1.23 1.07 1.84 2.8 1.31 3.49 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.37 1.24-3.21-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.31 1.23a11.4 11.4 0 016.02 0c2.3-1.55 3.31-1.23 3.31-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.9 1.24 3.21 0 4.61-2.8 5.62-5.47 5.92.43.37.82 1.11.82 2.24v3.32c0 .32.21.69.82.58A12 12 0 0012 .5z" />
  </svg>
);

function toLocalMidnight(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

// add days
function addDays(d, days) {
  const n = new Date(d);
  n.setDate(n.getDate() + days);
  return n;
}

// format YYYY-MM-DD
function fmt(date) {
  const d = toLocalMidnight(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// align back to previous Sunday (0 = Sunday)
function alignToSunday(d) {
  const copy = toLocalMidnight(d);
  const day = copy.getDay();
  return addDays(copy, -day);
}

// get month label map: columnIndex -> monthAbbrev (or null)
function monthLabelsForColumns(startDate, weeksCount) {
  const labels = {};
  for (let w = 0; w < weeksCount; w++) {
    const colStart = addDays(startDate, w * 7);
    const month = colStart.getMonth(); // 0-11
    const day = colStart.getDate();
    // show label on first-of-month-ish: choose if day <= 3 to prevent many labels
    if (day <= 3) labels[w] = githubConfig.months[month];
  }
  return labels;
}

export default function Github() {
  const [contribs, setContribs] = useState([]); // array of {date, count, level}
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // theme detection (prefers-color-scheme). You can also tie into your site's theme.
  const prefersDark =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [theme, setTheme] = useState(prefersDark ? 'dark' : 'light');

  useEffect(() => {
    const mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => setTheme(e.matches ? 'dark' : 'light');
    mq && mq.addEventListener && mq.addEventListener('change', handler);
    return () => mq && mq.removeEventListener && mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      try {
        setLoading(true);
        setError(false);

        const res = await fetch(`${githubConfig.apiUrl}/${githubConfig.username}.json`);
        const json = await res.json();

        if (!json?.contributions || !Array.isArray(json.contributions)) {
          throw new Error('Invalid contributions response');
        }

        // flatten nested arrays if required
        const flat = json.contributions.flat();

        // convert to uniform shape
        const mapped = flat
          .filter(
            (it) =>
              it &&
              typeof it === 'object' &&
              'date' in it &&
              'contributionCount' in it &&
              'contributionLevel' in it,
          )
          .map((it) => {
            const levelMap = {
              NONE: 0,
              FIRST_QUARTILE: 1,
              SECOND_QUARTILE: 2,
              THIRD_QUARTILE: 3,
              FOURTH_QUARTILE: 4,
            };
            return {
              date: String(it.date),
              count: Number(it.contributionCount || 0),
              level: levelMap[it.contributionLevel] || 0,
            };
          });

        if (!mounted) return;
        if (mapped.length === 0) {
          setError(true);
        }
        setContribs(mapped);
      } catch (err) {
        console.error('fetch contributions failed', err);
        if (!mounted) return;
        setError(true);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }

    fetchData();
    return () => (mounted = false);
  }, []);

  // Build date grid for last 1 year, aligned to weeks (Sunday -> Saturday)
  // Start from one year ago
  const today = toLocalMidnight(new Date());
  const oneYearAgo = addDays(toLocalMidnight(today), -365);
  const gridStart = alignToSunday(oneYearAgo);
  const gridEnd = today;

  // columns (weeks)
  // number of weeks = ceil(daysBetween / 7) + 1 maybe; compute by stepping weeks until after end
  const weeks = [];
  let cursor = toLocalMidnight(gridStart);
  while (cursor <= gridEnd) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      week.push(fmt(addDays(cursor, d)));
    }
    weeks.push(week);
    cursor = addDays(cursor, 7);
  }

  // map date -> {count, level}
  const dateMap = {};
  contribs.forEach((c) => {
    dateMap[c.date] = { count: c.count, level: c.level };
  });

  // month labels per column
  const monthLabels = monthLabelsForColumns(gridStart, weeks.length);

  // color palette from config (array of 5 strings)
  const palette = githubConfig.theme && githubConfig.theme[theme] ? githubConfig.theme[theme] : githubConfig.theme.light;

  // function to get fill color for a date
  function getColorForDate(isoDate) {
    const info = dateMap[isoDate];
    const level = info ? Math.max(0, Math.min(4, Number(info.level || 0))) : 0;
    // palette indexes correspond: 0..4
    return palette[level] || palette[0];
  }

  return (
      <div className="space-y-6 pb-20 hidden md:block">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white font-poppins">{githubConfig.title}</h2>
            <p className="text-sm text-gray-300">
              <p>Total: 2,247 contributions</p>
              {/* <b className="text-white">{githubConfig.username}</b>'s {githubConfig.subtitle} */}
            </p>
          </div>
        </div>
        {/* Grid */}
        {!loading && !error && (
          <div className="rounded-lg border border-dashed border-gray-600 p-2 bg-transparent">
            {/* month labels */}
            <div className="flex items-center mb-2"> {/* left padding for weekday column */}
              <div className="" /> {/* spacer where weekday column sits */}
              <div className="flex gap-1">
                {weeks.map((week, i) => (
                  <div key={i} style={{ minWidth: `${githubConfig.blockSize + 0}px` }} className="flex justify-center">
                    {monthLabels[i] && (
                      <div className="text-xs text-gray-300" style={{ width: githubConfig.blockSize }}>{monthLabels[i]}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex">
              {/* weekday labels (vertical column) */}
              <div className=" pr-2 flex flex-col justify-start items-end space-y-1 text-xs text-gray-400">
                {/* Show Monday, Wednesday, Friday as your config suggested */}
                {githubConfig.weekdays.map((wd, idx) => (
                  <div key={idx} style={{ height: `${githubConfig.blockSize}px`, lineHeight: `${githubConfig.blockSize}px` }}>
                    <span>{wd}</span>
                  </div>
                ))}
              </div>

              {/* weeks grid */}
              <div className="overflow-x-auto">
                <div className="flex gap-1">
                  {weeks.map((week, colIdx) => (
                    <div key={colIdx} className="flex flex-col gap-1">
                      {week.map((isoDate, dayIdx) => {
                        // If the date is beyond today, render an empty (invisible) cell
                        const dateObj = new Date(isoDate + 'T00:00:00');
                        if (dateObj > gridEnd) {
                          return (
                            <div
                              key={dayIdx}
                              style={{
                                width: `${githubConfig.blockSize}px`,
                                height: `${githubConfig.blockSize}px`,
                              }}
                            />
                          );
                        }

                        const color = getColorForDate(isoDate);
                        const info = dateMap[isoDate];
                        const titleText = `${isoDate}: ${info ? info.count : 0} contributions`;

                        return (
                          <div
                            key={dayIdx}
                            title={titleText}
                            className="rounded-sm border"
                            style={{
                              width: `${githubConfig.blockSize}px`,
                              height: `${githubConfig.blockSize}px`,
                              backgroundColor: color,
                              borderColor: 'rgba(0,0,0,0.15)',
                            }}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* legend */}
            <div className="mt-4 flex items-center gap-3 justify-end">
              <div className="text-sm text-gray-300 mr-2">Less</div>
              <div className="flex items-center gap-1">
                {palette.map((c, i) => (
                  <div
                    key={i}
                    style={{
                      width: `${githubConfig.blockSize}px`,
                      height: `${githubConfig.blockSize}px`,
                      backgroundColor: c,
                      borderRadius: 3,
                      border: '1px solid rgba(0,0,0,0.12)',
                    }}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-300 ml-2">More</div>
            </div>
          </div>
        )}
      </div>
  );
}

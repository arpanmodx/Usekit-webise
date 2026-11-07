import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { ResultBox } from '../ui/ResultBox';
import { Button } from '../ui/Button';
import { ResetButton } from '../ui/ResetButton';
import { CopyButton } from '../ui/CopyButton';
import { formatNumber } from '../../lib/querySync';

function formatMs(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  const centis = Math.floor((ms % 1000) / 10);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(
    centis
  ).padStart(2, '0')}`;
}

// 1. Stopwatch
export const StopwatchTool: React.FC = () => {
  const [running, setRunning] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [laps, setLaps] = useState<number[]>([]);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    startRef.current = performance.now() - elapsedMs;
    const id = window.setInterval(() => {
      if (startRef.current !== null) {
        setElapsedMs(performance.now() - startRef.current);
      }
    }, 30);
    return () => clearInterval(id);
  }, [running, elapsedMs]);

  return (
    <div className="space-y-6">
      <div className="p-8 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-5">
        <div className="text-4xl sm:text-6xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
          {formatMs(elapsedMs)}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            variant={running ? 'danger' : 'primary'}
            size="lg"
            onClick={() => setRunning((r) => !r)}
          >
            {running ? 'Pause' : elapsedMs > 0 ? 'Resume' : 'Start Stopwatch'}
          </Button>
          <Button
            variant="secondary"
            size="lg"
            disabled={!running && elapsedMs === 0}
            onClick={() => setLaps((prev) => [elapsedMs, ...prev])}
          >
            Record Lap
          </Button>
          <ResetButton
            onReset={() => {
              setRunning(false);
              setElapsedMs(0);
              setLaps([]);
            }}
            size="md"
          />
        </div>
      </div>

      {laps.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 max-h-64">
          <table className="w-full text-left text-xs sm:text-sm font-mono">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2 px-4">Lap #</th>
                <th className="py-2 px-4 text-right">Cumulative Split</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {laps.map((lapMs, i) => (
                <tr key={i}>
                  <td className="py-2 px-4">Lap {laps.length - i}</td>
                  <td className="py-2 px-4 text-right font-semibold">{formatMs(lapMs)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// 2. Online Timer
export const OnlineTimer: React.FC = () => {
  const [inputMinutes, setInputMinutes] = useState('5');
  const [inputSeconds, setInputSeconds] = useState('0');
  const [remainingSec, setRemainingSec] = useState(300);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setRemainingSec((prev) => {
        if (prev <= 1) {
          setRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  const applyPreset = (mins: number) => {
    setRunning(false);
    setInputMinutes(String(mins));
    setInputSeconds('0');
    setRemainingSec(mins * 60);
  };

  const hrs = Math.floor(remainingSec / 3600);
  const mins = Math.floor((remainingSec % 3600) / 60);
  const secs = remainingSec % 60;
  const display = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(
    secs
  ).padStart(2, '0')}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {[1, 5, 10, 15, 25, 45].map((m) => (
          <Button key={m} variant="outline" size="sm" onClick={() => applyPreset(m)}>
            {m} Min {m === 25 ? '(Pomodoro)' : ''}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          type="number"
          min="0"
          label="Set Minutes"
          value={inputMinutes}
          onChange={(e) => {
            setInputMinutes(e.target.value);
            setRunning(false);
            setRemainingSec((parseInt(e.target.value, 10) || 0) * 60 + (parseInt(inputSeconds, 10) || 0));
          }}
        />
        <Input
          type="number"
          min="0"
          max="59"
          label="Set Seconds"
          value={inputSeconds}
          onChange={(e) => {
            setInputSeconds(e.target.value);
            setRunning(false);
            setRemainingSec((parseInt(inputMinutes, 10) || 0) * 60 + (parseInt(e.target.value, 10) || 0));
          }}
        />
      </div>

      <div className="p-8 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4">
        <div className="text-4xl sm:text-6xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
          {display}
        </div>
        <div className="flex justify-center gap-3">
          <Button
            variant={running ? 'danger' : 'primary'}
            size="lg"
            onClick={() => setRunning((r) => !r)}
          >
            {running ? 'Pause Timer' : 'Start Timer'}
          </Button>
          <ResetButton
            onReset={() => {
              setRunning(false);
              setRemainingSec(
                (parseInt(inputMinutes, 10) || 0) * 60 + (parseInt(inputSeconds, 10) || 0)
              );
            }}
            size="md"
          />
        </div>
      </div>
    </div>
  );
};

// 3. World Clock
const WORLD_CITIES = [
  { city: 'UTC / GMT', tz: 'UTC' },
  { city: 'Mumbai / New Delhi (IST)', tz: 'Asia/Kolkata' },
  { city: 'Dhaka (BST)', tz: 'Asia/Dhaka' },
  { city: 'London (GMT/BST)', tz: 'Europe/London' },
  { city: 'New York (ET)', tz: 'America/New_York' },
  { city: 'San Francisco (PT)', tz: 'America/Los_Angeles' },
  { city: 'Dubai (GST)', tz: 'Asia/Dubai' },
  { city: 'Singapore (SGT)', tz: 'Asia/Singapore' },
  { city: 'Tokyo (JST)', tz: 'Asia/Tokyo' },
  { city: 'Sydney (AET)', tz: 'Australia/Sydney' },
];

export const WorldClock: React.FC = () => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {WORLD_CITIES.map((item) => {
        const timeStr = new Intl.DateTimeFormat('en-US', {
          timeZone: item.tz,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }).format(now);
        const dateStr = new Intl.DateTimeFormat('en-US', {
          timeZone: item.tz,
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }).format(now);
        return (
          <ResultBox
            key={item.tz}
            highlight={item.tz === 'Asia/Kolkata' || item.tz === 'UTC'}
            label={item.city}
            value={timeStr}
            sublabel={`${dateStr} (${item.tz})`}
          />
        );
      })}
    </div>
  );
};

// 4. Time Zone Converter
export const TimeZoneConverter: React.FC = () => {
  const [dateTime, setDateTime] = useState('2025-05-15T14:30');
  const [fromTz, setFromTz] = useState('Asia/Kolkata');
  const [toTz, setToTz] = useState('America/New_York');

  const converted = useMemo(() => {
    try {
      const dt = new Date(dateTime);
      if (isNaN(dt.getTime())) return 'Enter a valid date and time.';
      return new Intl.DateTimeFormat('en-US', {
        timeZone: toTz,
        dateStyle: 'full',
        timeStyle: 'long',
      }).format(dt);
    } catch {
      return 'Invalid date/timezone.';
    }
  }, [dateTime, toTz]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          type="datetime-local"
          label="Source Date & Time"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
        />
        <Select
          label="Reference Time Zone"
          value={fromTz}
          onChange={(e) => setFromTz(e.target.value)}
          options={WORLD_CITIES.map((c) => ({ value: c.tz, label: c.city }))}
        />
        <Select
          label="Target Time Zone"
          value={toTz}
          onChange={(e) => setToTz(e.target.value)}
          options={WORLD_CITIES.map((c) => ({ value: c.tz, label: c.city }))}
        />
      </div>

      <ResultBox
        highlight
        label={`Converted Time in ${toTz}`}
        value={converted}
        copyText={converted}
      />
    </div>
  );
};

// 5. Countdown Timer
export const CountdownTimer: React.FC = () => {
  const [eventName, setEventName] = useState('New Year Launch');
  const [targetIso, setTargetIso] = useState(() => {
    const nextYear = new Date().getFullYear() + 1;
    return `${nextYear}-01-01T00:00`;
  });
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = useMemo(() => {
    const targetMs = new Date(targetIso).getTime();
    if (isNaN(targetMs)) return null;
    const rem = Math.max(0, targetMs - nowMs);
    const totalSec = Math.floor(rem / 1000);
    const days = Math.floor(totalSec / 86400);
    const hours = Math.floor((totalSec % 86400) / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    return { days, hours, minutes, seconds };
  }, [targetIso, nowMs]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Event Title"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
        />
        <Input
          type="datetime-local"
          label="Target Date & Time"
          value={targetIso}
          onChange={(e) => setTargetIso(e.target.value)}
        />
      </div>

      {diff && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <ResultBox highlight label="Days" value={formatNumber(diff.days)} />
          <ResultBox highlight label="Hours" value={String(diff.hours).padStart(2, '0')} />
          <ResultBox highlight label="Minutes" value={String(diff.minutes).padStart(2, '0')} />
          <ResultBox highlight label="Seconds" value={String(diff.seconds).padStart(2, '0')} />
        </div>
      )}
    </div>
  );
};

// 6. Business Days Calculator
export const BusinessDaysCalculator: React.FC = () => {
  const [startDate, setStartDate] = useState('2025-05-01');
  const [businessDaysToAdd, setBusinessDaysToAdd] = useState('10');

  const res = useMemo(() => {
    const dt = new Date(`${startDate}T00:00:00Z`);
    const daysToAdd = parseInt(businessDaysToAdd, 10);
    if (isNaN(dt.getTime()) || !Number.isFinite(daysToAdd)) return null;

    const step = daysToAdd >= 0 ? 1 : -1;
    let remaining = Math.abs(daysToAdd);
    let totalCalendarDays = 0;
    const cursor = new Date(dt.getTime());

    while (remaining > 0 && totalCalendarDays < 5000) {
      cursor.setUTCDate(cursor.getUTCDate() + step);
      totalCalendarDays += 1;
      const dow = cursor.getUTCDay();
      if (dow !== 0 && dow !== 6) {
        remaining -= 1;
      }
    }

    const isoResult = cursor.toISOString().split('T')[0];
    return { isoResult, totalCalendarDays };
  }, [startDate, businessDaysToAdd]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          type="date"
          label="Starting Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <Input
          type="number"
          min="-1000"
          max="1000"
          label="Business Days to Add (+ or −)"
          value={businessDaysToAdd}
          onChange={(e) => setBusinessDaysToAdd(e.target.value)}
        />
      </div>

      {res && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ResultBox
            highlight
            label="Target Business Date (Mon–Fri)"
            value={res.isoResult}
            copyText={res.isoResult}
          />
          <ResultBox
            label="Total Calendar Days Spanned"
            value={`${res.totalCalendarDays} calendar days`}
          />
        </div>
      )}
    </div>
  );
};

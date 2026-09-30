'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownProps {
  weddingDate: string | null;
  timezone: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
}

function getTimeLeft(weddingDate: string, timezone: string): TimeLeft | null {
  const now = new Date();
  const target = new Date(weddingDate);
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
  };
}

export function Countdown({ weddingDate, timezone }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!weddingDate) return;

    function tick() {
      setTimeLeft(getTimeLeft(weddingDate!, timezone));
    }

    tick();
    const interval = setInterval(tick, 60_000);
    return () => clearInterval(interval);
  }, [weddingDate, timezone]);

  if (!weddingDate) {
    return (
      <div className="flex items-center gap-2 text-muted">
        <Clock className="h-5 w-5" />
        <span className="text-sm">No wedding date set</span>
      </div>
    );
  }

  if (!mounted) return null;

  if (!timeLeft) {
    return (
      <p className="text-sm text-muted">
        Your wedding day has arrived — congratulations!
      </p>
    );
  }

  const formattedWeddingDate = new Date(weddingDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div>
      <div className="flex items-center gap-6">
        <CountdownUnit value={timeLeft.days} label="Days" />
        <span className="text-2xl font-light text-border">:</span>
        <CountdownUnit value={timeLeft.hours} label="Hours" />
        <span className="text-2xl font-light text-border">:</span>
        <CountdownUnit value={timeLeft.minutes} label="Minutes" />
      </div>
      <p className="text-sm text-stone-500 mt-1">
        Days to go · {formattedWeddingDate}
      </p>
    </div>
  );
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <p className="text-3xl font-bold text-foreground tabular-nums">
        {String(value).padStart(2, '0')}
      </p>
      <p className="text-xs text-muted uppercase tracking-wider">{label}</p>
    </div>
  );
}

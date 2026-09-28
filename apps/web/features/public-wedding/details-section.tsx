import { MapPin, Clock, Shirt } from 'lucide-react';
import { DressCodeCouples } from './dress-code-couples';

interface DetailsSectionProps {
  ceremonyName: string | null;
  ceremonyAddress: string | null;
  ceremonyTime: string | null;
  receptionName: string | null;
  receptionAddress: string | null;
  receptionTime: string | null;
  dressCode: string | null;
  dressCodeColors: string[] | null;
  primaryColor: string;
  timezone: string;
}

function formatTime(isoDate: string, timezone: string) {
  return new Date(isoDate).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: timezone,
  });
}

function formatDate(isoDate: string, timezone: string) {
  return new Date(isoDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: timezone,
  });
}

function VenueCard({
  label,
  name,
  address,
  time,
  timezone,
}: {
  label: string;
  name: string | null;
  address: string | null;
  time: string | null;
  timezone: string;
}) {
  if (!name && !address && !time) return null;

  return (
    <div className="flex-1 min-w-[280px] rounded-lg border p-8 text-center"
         style={{ borderColor: 'var(--wedding-secondary)', backgroundColor: 'var(--wedding-background)' }}>
      <p className="text-sm uppercase tracking-[0.2em] mb-3"
         style={{ color: 'var(--wedding-primary)' }}>
        {label}
      </p>
      {name && (
        <h3 className="text-xl font-serif font-semibold mb-3"
            style={{ color: 'var(--wedding-foreground)' }}>
          {name}
        </h3>
      )}
      {address && (
        <div className="flex items-center justify-center gap-1.5 mb-2">
          <MapPin className="h-4 w-4 shrink-0" style={{ color: 'var(--wedding-primary)' }} />
          <p className="text-sm" style={{ color: 'var(--wedding-foreground)', opacity: 0.7 }}>
            {address}
          </p>
        </div>
      )}
      {time && (
        <div className="flex items-center justify-center gap-1.5">
          <Clock className="h-4 w-4 shrink-0" style={{ color: 'var(--wedding-primary)' }} />
          <p className="text-sm" style={{ color: 'var(--wedding-foreground)', opacity: 0.7 }}>
            {formatDate(time, timezone)} &middot; {formatTime(time, timezone)}
          </p>
        </div>
      )}
    </div>
  );
}

export function DetailsSection({
  ceremonyName,
  ceremonyAddress,
  ceremonyTime,
  receptionName,
  receptionAddress,
  receptionTime,
  dressCode,
  dressCodeColors,
  primaryColor,
  timezone,
}: DetailsSectionProps) {
  const hasCeremony = ceremonyName || ceremonyAddress || ceremonyTime;
  const hasReception = receptionName || receptionAddress || receptionTime;

  if (!hasCeremony && !hasReception && !dressCode) return null;

  return (
    <section className="px-6 py-20 md:py-28"
             style={{ backgroundColor: 'var(--wedding-secondary)', opacity: 1 }}>
      <div className="mx-auto max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12"
            style={{ color: 'var(--wedding-foreground)' }}>
          Wedding Details
        </h2>

        <div className="flex flex-col md:flex-row gap-6 justify-center">
          {hasCeremony && (
            <VenueCard
              label="Ceremony"
              name={ceremonyName}
              address={ceremonyAddress}
              time={ceremonyTime}
              timezone={timezone}
            />
          )}
          {hasReception && (
            <VenueCard
              label="Reception"
              name={receptionName}
              address={receptionAddress}
              time={receptionTime}
              timezone={timezone}
            />
          )}
        </div>

        {dressCode && (
          <div className="mt-12 text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Shirt className="h-4 w-4" style={{ color: 'var(--wedding-primary)' }} />
              <p className="text-sm uppercase tracking-[0.15em] font-medium"
                 style={{ color: 'var(--wedding-foreground)' }}>
                Dress Code
              </p>
            </div>
            <DressCodeCouples
              colors={dressCodeColors ?? []}
              primaryColor={primaryColor}
            />
            <p className="mt-4 text-base font-serif font-semibold"
               style={{ color: 'var(--wedding-foreground)' }}>
              {dressCode}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

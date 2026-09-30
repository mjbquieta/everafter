'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Clock, Shirt, X, Map } from 'lucide-react';
import { DressCodeCouples } from './dress-code-couples';
import { resolveUploadUrl } from '@/lib/api-client';

const VenueMap = dynamic(
  () => import('./venue-map').then((m) => m.VenueMap),
  { ssr: false },
);

interface DetailsSectionProps {
  ceremonyName: string | null;
  ceremonyAddress: string | null;
  ceremonyTime: string | null;
  ceremonyImage: string | null;
  receptionName: string | null;
  receptionAddress: string | null;
  receptionTime: string | null;
  receptionImage: string | null;
  weddingDate: string | null;
  dressCode: string | null;
  dressCodeColors: string[] | null;
  primaryColor: string;
  timezone: string;
  layout?: string;
}

interface VenueInfo {
  label: string;
  name: string | null;
  address: string | null;
  dateTime: string | null;
  image: string | null;
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

function formatDateTime(
  weddingDate: string | null,
  venueTime: string | null,
  timezone: string,
): string | null {
  if (!weddingDate && !venueTime) return null;
  const parts: string[] = [];
  if (weddingDate) parts.push(formatDate(weddingDate, timezone));
  if (venueTime) parts.push(formatTime(venueTime, timezone));
  return parts.join(' \u00b7 ');
}

// ── Venue Map Modal ──
function VenueMapModal({
  venue,
  onClose,
}: {
  venue: VenueInfo;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
        style={{ backgroundColor: 'var(--wedding-background, #fff)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <h3
            className="text-lg font-serif font-semibold"
            style={{ color: 'var(--wedding-foreground)' }}
          >
            {venue.label}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 transition-colors hover:bg-black/5"
            style={{ color: 'var(--wedding-foreground)' }}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Details */}
        <div className="px-6 pb-4 space-y-2.5">
          {venue.name && (
            <div className="flex items-start gap-2.5">
              <MapPin
                className="h-4 w-4 mt-0.5 shrink-0"
                style={{ color: 'var(--wedding-primary)' }}
              />
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: 'var(--wedding-foreground)' }}
                >
                  {venue.name}
                </p>
                {venue.address && (
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: 'var(--wedding-foreground)', opacity: 0.6 }}
                  >
                    {venue.address}
                  </p>
                )}
              </div>
            </div>
          )}
          {venue.dateTime && (
            <div className="flex items-center gap-2.5">
              <Clock
                className="h-4 w-4 shrink-0"
                style={{ color: 'var(--wedding-primary)' }}
              />
              <p
                className="text-sm"
                style={{ color: 'var(--wedding-foreground)', opacity: 0.7 }}
              >
                {venue.dateTime}
              </p>
            </div>
          )}
        </div>

        {/* Map */}
        {venue.address && (
          <div className="px-6 pb-6">
            <VenueMap address={venue.address} className="h-64" />
          </div>
        )}
      </div>
    </div>
  );
}

// ── Shared View Map Button ──
function ViewMapButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors border"
      style={{
        color: 'var(--wedding-primary)',
        borderColor: 'var(--wedding-primary)',
      }}
    >
      <Map className="h-3.5 w-3.5" />
      View Map
    </button>
  );
}

// ── Classic venue card ──
function VenueCard({
  venue,
  onViewMap,
}: {
  venue: VenueInfo;
  onViewMap: () => void;
}) {
  if (!venue.name && !venue.address && !venue.dateTime) return null;

  return (
    <div
      className="rounded-xl overflow-hidden border"
      style={{
        borderColor: 'var(--wedding-secondary)',
        backgroundColor: 'var(--wedding-background)',
      }}
    >
      {venue.image && (
        <img
          src={resolveUploadUrl(venue.image)!}
          alt={`${venue.label} venue`}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-8 text-center">
        <p
          className="font-sans text-xs font-semibold uppercase tracking-[0.2em] mb-3"
          style={{ color: 'var(--wedding-primary)' }}
        >
          {venue.label}
        </p>
        {venue.name && (
          <h3
            className="text-xl font-serif font-medium tracking-tight mb-3"
            style={{ color: 'var(--wedding-foreground)' }}
          >
            {venue.name}
          </h3>
        )}
        {venue.dateTime && (
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Clock
              className="h-4 w-4 shrink-0"
              style={{ color: 'var(--wedding-primary)' }}
            />
            <p
              className="text-sm"
              style={{ color: 'var(--wedding-foreground)', opacity: 0.7 }}
            >
              {venue.dateTime}
            </p>
          </div>
        )}
        {venue.address && (
          <div className="flex items-center justify-center gap-1.5">
            <MapPin
              className="h-4 w-4 shrink-0"
              style={{ color: 'var(--wedding-primary)' }}
            />
            <p
              className="text-sm"
              style={{ color: 'var(--wedding-foreground)', opacity: 0.7 }}
            >
              {venue.address}
            </p>
          </div>
        )}
        {venue.address && <ViewMapButton onClick={onViewMap} />}
      </div>
    </div>
  );
}

// ── Magazine venue block ──
function MagazineVenueBlock({
  venue,
  onViewMap,
}: {
  venue: VenueInfo;
  onViewMap: () => void;
}) {
  if (!venue.name && !venue.address && !venue.dateTime) return null;

  return (
    <div
      className="py-6 border-t"
      style={{ borderColor: 'var(--wedding-primary)', opacity: 1 }}
    >
      {venue.image && (
        <img
          src={resolveUploadUrl(venue.image)!}
          alt={`${venue.label} venue`}
          className="w-full h-40 object-cover rounded-lg mb-4"
        />
      )}
      <p
        className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] mb-3"
        style={{ color: 'var(--wedding-primary)' }}
      >
        {venue.label}
      </p>
      {venue.name && (
        <h3
          className="text-xl md:text-2xl font-serif font-bold tracking-tight mb-2"
          style={{ color: 'var(--wedding-foreground)' }}
        >
          {venue.name}
        </h3>
      )}
      {venue.dateTime && (
        <div className="flex items-center gap-1.5 mb-1.5">
          <Clock
            className="h-3.5 w-3.5 shrink-0"
            style={{ color: 'var(--wedding-primary)' }}
          />
          <p
            className="text-sm"
            style={{ color: 'var(--wedding-foreground)', opacity: 0.7 }}
          >
            {venue.dateTime}
          </p>
        </div>
      )}
      {venue.address && (
        <div className="flex items-center gap-1.5">
          <MapPin
            className="h-3.5 w-3.5 shrink-0"
            style={{ color: 'var(--wedding-primary)' }}
          />
          <p
            className="text-sm"
            style={{ color: 'var(--wedding-foreground)', opacity: 0.7 }}
          >
            {venue.address}
          </p>
        </div>
      )}
      {venue.address && <ViewMapButton onClick={onViewMap} />}
    </div>
  );
}

// ── Editorial venue block ──
function EditorialVenueBlock({
  venue,
  onViewMap,
}: {
  venue: VenueInfo;
  onViewMap: () => void;
}) {
  if (!venue.name && !venue.address && !venue.dateTime) return null;

  return (
    <div className="mb-12">
      {venue.image && (
        <img
          src={resolveUploadUrl(venue.image)!}
          alt={`${venue.label} venue`}
          className="w-full h-56 object-cover rounded-lg mb-6"
        />
      )}
      <p
        className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] mb-4"
        style={{ color: 'var(--wedding-primary)' }}
      >
        {venue.label}
      </p>
      {venue.name && (
        <h3
          className="text-2xl md:text-3xl font-serif font-medium tracking-tight mb-3"
          style={{ color: 'var(--wedding-foreground)' }}
        >
          {venue.name}
        </h3>
      )}
      {venue.dateTime && (
        <p
          className="text-base md:text-lg font-serif mb-2"
          style={{ color: 'var(--wedding-foreground)', opacity: 0.7 }}
        >
          {venue.dateTime}
        </p>
      )}
      {venue.address && (
        <p
          className="text-base md:text-lg font-serif"
          style={{ color: 'var(--wedding-foreground)', opacity: 0.7 }}
        >
          {venue.address}
        </p>
      )}
      {venue.address && <ViewMapButton onClick={onViewMap} />}
    </div>
  );
}

export function DetailsSection({
  ceremonyName,
  ceremonyAddress,
  ceremonyTime,
  ceremonyImage,
  receptionName,
  receptionAddress,
  receptionTime,
  receptionImage,
  weddingDate,
  dressCode,
  dressCodeColors,
  primaryColor,
  timezone,
  layout,
}: DetailsSectionProps) {
  const [mapVenue, setMapVenue] = useState<VenueInfo | null>(null);

  const hasCeremony = ceremonyName || ceremonyAddress || ceremonyTime;
  const hasReception = receptionName || receptionAddress || receptionTime;

  if (!hasCeremony && !hasReception && !dressCode) return null;

  const isMagazine = layout === 'magazine';
  const isEditorial = layout === 'editorial';

  const ceremonyVenue: VenueInfo = {
    label: 'Ceremony',
    name: ceremonyName,
    address: ceremonyAddress,
    dateTime: formatDateTime(weddingDate, ceremonyTime, timezone),
    image: ceremonyImage,
  };

  const receptionVenue: VenueInfo = {
    label: 'Reception',
    name: receptionName,
    address: receptionAddress,
    dateTime: formatDateTime(weddingDate, receptionTime, timezone),
    image: receptionImage,
  };

  // ── Magazine ──
  if (isMagazine) {
    return (
      <section id="details">
        <h2
          className="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-4"
          style={{ color: 'var(--wedding-foreground)' }}
        >
          Wedding Details
        </h2>
        <div
          className="h-0.5 w-16 mb-8"
          style={{ backgroundColor: 'var(--wedding-primary)' }}
        />

        <div className="space-y-0">
          {hasCeremony && (
            <MagazineVenueBlock
              venue={ceremonyVenue}
              onViewMap={() => setMapVenue(ceremonyVenue)}
            />
          )}
          {hasReception && (
            <MagazineVenueBlock
              venue={receptionVenue}
              onViewMap={() => setMapVenue(receptionVenue)}
            />
          )}
        </div>

        {dressCode && (
          <div
            className="mt-8 py-6 border-t"
            style={{ borderColor: 'var(--wedding-primary)' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Shirt
                className="h-4 w-4"
                style={{ color: 'var(--wedding-primary)' }}
              />
              <p
                className="font-sans text-[10px] font-bold uppercase tracking-[0.3em]"
                style={{ color: 'var(--wedding-foreground)' }}
              >
                Dress Code
              </p>
            </div>
            <DressCodeCouples
              colors={dressCodeColors ?? []}
              primaryColor={primaryColor}
            />
            <p
              className="mt-3 text-base font-serif font-semibold"
              style={{ color: 'var(--wedding-foreground)' }}
            >
              {dressCode}
            </p>
          </div>
        )}

        {mapVenue && (
          <VenueMapModal
            venue={mapVenue}
            onClose={() => setMapVenue(null)}
          />
        )}
      </section>
    );
  }

  // ── Editorial ──
  if (isEditorial) {
    return (
      <section id="details">
        <p
          className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] mb-6"
          style={{ color: 'var(--wedding-primary)' }}
        >
          Details
        </p>

        <div className="max-w-2xl">
          {hasCeremony && (
            <EditorialVenueBlock
              venue={ceremonyVenue}
              onViewMap={() => setMapVenue(ceremonyVenue)}
            />
          )}
          {hasReception && (
            <EditorialVenueBlock
              venue={receptionVenue}
              onViewMap={() => setMapVenue(receptionVenue)}
            />
          )}

          {dressCode && (
            <div className="mt-4">
              <p
                className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] mb-4"
                style={{ color: 'var(--wedding-primary)' }}
              >
                Dress Code
              </p>
              <DressCodeCouples
                colors={dressCodeColors ?? []}
                primaryColor={primaryColor}
              />
              <p
                className="mt-4 text-xl md:text-2xl font-serif font-medium"
                style={{ color: 'var(--wedding-foreground)' }}
              >
                {dressCode}
              </p>
            </div>
          )}
        </div>

        {mapVenue && (
          <VenueMapModal
            venue={mapVenue}
            onClose={() => setMapVenue(null)}
          />
        )}
      </section>
    );
  }

  // ── Classic ──
  return (
    <section id="details">
      <h2
        className="text-3xl md:text-4xl font-serif font-medium tracking-tight text-center mb-12"
        style={{ color: 'var(--wedding-foreground)' }}
      >
        Wedding Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {hasCeremony && (
          <VenueCard
            venue={ceremonyVenue}
            onViewMap={() => setMapVenue(ceremonyVenue)}
          />
        )}
        {hasReception && (
          <VenueCard
            venue={receptionVenue}
            onViewMap={() => setMapVenue(receptionVenue)}
          />
        )}
      </div>

      {dressCode && (
        <div className="mt-12 mx-auto max-w-lg text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Shirt
              className="h-4 w-4"
              style={{ color: 'var(--wedding-primary)' }}
            />
            <p
              className="font-sans text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: 'var(--wedding-foreground)' }}
            >
              Dress Code
            </p>
          </div>
          <DressCodeCouples
            colors={dressCodeColors ?? []}
            primaryColor={primaryColor}
          />
          <p
            className="mt-4 text-base font-serif font-semibold"
            style={{ color: 'var(--wedding-foreground)' }}
          >
            {dressCode}
          </p>
        </div>
      )}

      {mapVenue && (
        <VenueMapModal
          venue={mapVenue}
          onClose={() => setMapVenue(null)}
        />
      )}
    </section>
  );
}

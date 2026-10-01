'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, XCircle, ArrowRight, Calendar, MapPin } from 'lucide-react';
import { Button, Input } from '@everafter/ui';
import { AudioPlayer } from '@/features/public-wedding';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

interface WeddingData {
  wedding: {
    id: string;
    slug: string;
    title: string;
    weddingDate: string | null;
    timezone: string;
  };
  profile: {
    brideName: string | null;
    groomName: string | null;
    ceremonyName: string | null;
    ceremonyAddress: string | null;
  };
  settings: {
    theme: string;
    primaryColor: string;
    secondaryColor: string;
    font: string;
    heroBanner: string | null;
    enableBackgroundMusic: boolean;
    audioUrl: string | null;
  };
}

interface GuestData {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  notes: string | null;
  rsvp: {
    status: string;
    companionCount: number;
    mealPreference: string | null;
    notes: string | null;
  } | null;
}

interface PersonalInvitationClientProps {
  wedding: WeddingData;
  guest: GuestData;
}

const fontMap: Record<string, string> = {
  Inter: "'Inter', sans-serif",
  Playfair: "'Playfair Display', serif",
  Lora: "'Lora', serif",
  Montserrat: "'Montserrat', sans-serif",
};

const themeBackgrounds: Record<string, string> = {
  'warm-linen': '#F9F6F0',
  'moody-plum': '#F5F2F7',
  'dusty-rose': '#FAF0F2',
  'coastal-slate': '#EDF3F7',
  'midnight-editorial': '#0F1015',
};

export function PersonalInvitationClient({ wedding, guest }: PersonalInvitationClientProps) {
  // Parse companion limit from guest notes metadata
  // Check both guest.notes and rsvp.notes for the metadata
  const guestNotesMatch = guest.rsvp?.notes?.match(/\[companions:(\d+)\]/) ?? guest.notes?.match(/\[companions:(\d+)\]/) ?? null;
  const maxCompanions = guestNotesMatch ? parseInt(guestNotesMatch[1]) : 0;
  const allowsCompanions = maxCompanions > 0;
  const totalSeats = 1 + maxCompanions;

  const [step, setStep] = useState<'form' | 'confirmed'>(guest.rsvp ? 'confirmed' : 'form');
  const [rsvpStatus, setRsvpStatus] = useState<'ACCEPTED' | 'DECLINED'>(
    guest.rsvp?.status === 'ACCEPTED' || guest.rsvp?.status === 'DECLINED'
      ? guest.rsvp.status
      : 'ACCEPTED'
  );
  const [companionCount, setCompanionCount] = useState(guest.rsvp?.companionCount ?? 0);
  const [notes, setNotes] = useState(
    guest.rsvp?.notes?.replace(/\[companions:\d+\]\s*/, '') ?? ''
  );
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const coupleNames =
    wedding.profile.brideName && wedding.profile.groomName
      ? `${wedding.profile.brideName} & ${wedding.profile.groomName}`
      : wedding.wedding.title;

  const backgroundColor = themeBackgrounds[wedding.settings.theme] ?? '#FAF9F7';
  const isDark = backgroundColor === '#0F1015';
  const foregroundColor = isDark ? '#F5F3EF' : '#2B2726';

  const cssVars = {
    '--wedding-primary': wedding.settings.primaryColor,
    '--wedding-secondary': wedding.settings.secondaryColor,
    '--wedding-background': backgroundColor,
    '--wedding-foreground': foregroundColor,
    '--wedding-font': fontMap[wedding.settings.font] ?? fontMap.Inter,
  } as React.CSSProperties;

  const handleSubmit = async () => {
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/public/weddings/${wedding.wedding.slug}/rsvp`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: guest.firstName,
            lastName: guest.lastName,
            status: rsvpStatus,
            companionCount: rsvpStatus === 'ACCEPTED' ? companionCount : 0,
            notes: notes || undefined,
          }),
        }
      );
      const body = await res.json();
      if (!res.ok) {
        setError(body.error?.message ?? 'Something went wrong');
        return;
      }
      setStep('confirmed');
      setIsUpdating(false);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formattedDate = wedding.wedding.weddingDate
    ? new Date(wedding.wedding.weddingDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: wedding.wedding.timezone,
      })
    : null;

  const ceremonyLocation = wedding.profile.ceremonyName
    ? `${wedding.profile.ceremonyName}${
        wedding.profile.ceremonyAddress
          ? `, ${wedding.profile.ceremonyAddress.split(',').slice(-2).join(',').trim()}`
          : ''
      }`
    : wedding.profile.ceremonyAddress || null;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        ...cssVars,
        backgroundColor: 'var(--wedding-background)',
        color: 'var(--wedding-foreground)',
        fontFamily: 'var(--wedding-font)',
      }}
    >
      <div className="max-w-xl mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen">
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="font-serif text-3xl md:text-4xl font-medium tracking-tight mb-2"
            style={{ color: 'var(--wedding-foreground)' }}
          >
            {coupleNames}
          </h1>
          <p
            className="text-xs tracking-[0.2em] uppercase mb-4"
            style={{ color: 'var(--wedding-foreground)', opacity: 0.6 }}
          >
            Request the honour of your presence
          </p>
          {formattedDate && (
            <div className="flex items-center justify-center gap-2 text-sm mb-2">
              <Calendar className="h-4 w-4" style={{ color: 'var(--wedding-primary)' }} />
              <span style={{ color: 'var(--wedding-foreground)', opacity: 0.8 }}>
                {formattedDate}
              </span>
            </div>
          )}
          {ceremonyLocation && (
            <div className="flex items-center justify-center gap-2 text-sm">
              <MapPin className="h-4 w-4" style={{ color: 'var(--wedding-primary)' }} />
              <span style={{ color: 'var(--wedding-foreground)', opacity: 0.8 }}>
                {ceremonyLocation}
              </span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-full max-w-xs mb-8 flex items-center justify-center gap-2">
          <div
            className="h-px flex-1"
            style={{ backgroundColor: 'var(--wedding-primary)', opacity: 0.2 }}
          />
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: 'var(--wedding-primary)' }}
          />
          <div
            className="h-px flex-1"
            style={{ backgroundColor: 'var(--wedding-primary)', opacity: 0.2 }}
          />
        </div>

        {/* Guest Card */}
        <div
          className="w-full bg-white rounded-lg border shadow-lg p-6 md:p-8"
          style={{
            borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
          }}
        >
          {step === 'form' || isUpdating ? (
            <div className="space-y-6">
              <div className="text-center">
                <p
                  className="font-serif text-base italic mb-1"
                  style={{ color: 'var(--wedding-foreground)', opacity: 0.7 }}
                >
                  Dear
                </p>
                <p
                  className="font-serif text-xl md:text-2xl font-medium"
                  style={{ color: 'var(--wedding-foreground)' }}
                >
                  {guest.firstName} {guest.lastName}
                </p>
                <p
                  className="text-sm mt-3 leading-relaxed"
                  style={{ color: 'var(--wedding-foreground)', opacity: 0.7 }}
                >
                  {allowsCompanions
                    ? `We have reserved up to ${totalSeats} seat${totalSeats !== 1 ? 's' : ''} in your honor.`
                    : 'We have reserved 1 seat in your honor.'}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setRsvpStatus('ACCEPTED')}
                  className="flex-1 rounded-lg border-2 py-4 text-center text-sm font-medium transition-all"
                  style={{
                    borderColor:
                      rsvpStatus === 'ACCEPTED'
                        ? 'var(--wedding-primary)'
                        : isDark
                          ? 'rgba(255,255,255,0.2)'
                          : 'var(--wedding-secondary)',
                    backgroundColor:
                      rsvpStatus === 'ACCEPTED'
                        ? 'var(--wedding-primary)'
                        : 'transparent',
                    color:
                      rsvpStatus === 'ACCEPTED' ? '#fff' : 'var(--wedding-foreground)',
                  }}
                >
                  <CheckCircle2 className="h-5 w-5 mx-auto mb-1" />
                  Joyfully Accepts
                </button>
                <button
                  onClick={() => setRsvpStatus('DECLINED')}
                  className="flex-1 rounded-lg border-2 py-4 text-center text-sm font-medium transition-all"
                  style={{
                    borderColor:
                      rsvpStatus === 'DECLINED'
                        ? 'var(--wedding-primary)'
                        : isDark
                          ? 'rgba(255,255,255,0.2)'
                          : 'var(--wedding-secondary)',
                    backgroundColor:
                      rsvpStatus === 'DECLINED'
                        ? 'var(--wedding-primary)'
                        : 'transparent',
                    color:
                      rsvpStatus === 'DECLINED' ? '#fff' : 'var(--wedding-foreground)',
                  }}
                >
                  <XCircle className="h-5 w-5 mx-auto mb-1" />
                  Regretfully Declines
                </button>
              </div>

              {rsvpStatus === 'ACCEPTED' && allowsCompanions && (
                <div>
                  <label
                    className="block text-sm font-medium mb-1.5"
                    style={{ color: 'var(--wedding-foreground)' }}
                  >
                    Number of additional companions
                  </label>
                  <Input
                    type="number"
                    min={0}
                    max={maxCompanions}
                    value={companionCount}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value >= 0 && value <= maxCompanions) {
                        setCompanionCount(value);
                      }
                    }}
                  />
                  <p
                    className="text-xs mt-1.5"
                    style={{ color: 'var(--wedding-foreground)', opacity: 0.6 }}
                  >
                    You may bring up to {maxCompanions} companion{maxCompanions !== 1 ? 's' : ''}.
                  </p>
                </div>
              )}

              <div>
                <label
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: 'var(--wedding-foreground)' }}
                >
                  Notes for the couple (optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="A message or song request..."
                  className="flex w-full rounded-md border px-3 py-2 text-sm placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  style={{
                    borderColor: isDark ? 'rgba(255,255,255,0.2)' : '#e5e7eb',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                    color: 'var(--wedding-foreground)',
                  }}
                />
              </div>

              {error && (
                <p className="text-sm text-center" style={{ color: '#dc2626' }}>
                  {error}
                </p>
              )}

              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full"
                style={{ backgroundColor: 'var(--wedding-primary)', color: '#fff' }}
              >
                {isLoading ? 'Submitting...' : 'Confirm RSVP'}
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-6 py-4">
              <div
                className="w-16 h-16 rounded-full mx-auto flex items-center justify-center"
                style={{ backgroundColor: 'var(--wedding-primary)', opacity: 0.1 }}
              >
                <CheckCircle2
                  className="h-8 w-8"
                  style={{ color: 'var(--wedding-primary)' }}
                />
              </div>
              <div>
                <h2
                  className="font-serif text-2xl font-medium mb-2"
                  style={{ color: 'var(--wedding-foreground)' }}
                >
                  Thank you, {guest.firstName}!
                </h2>
                <p
                  className="text-sm"
                  style={{ color: 'var(--wedding-foreground)', opacity: 0.7 }}
                >
                  Your response has been recorded.
                </p>
                {guest.rsvp && (
                  <p
                    className="text-sm mt-2"
                    style={{ color: 'var(--wedding-foreground)', opacity: 0.6 }}
                  >
                    Status: <span className="font-medium">{guest.rsvp.status === 'ACCEPTED' ? 'Attending' : 'Declined'}</span>
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => setIsUpdating(true)}
                  variant="outline"
                  className="w-full"
                  style={{
                    borderColor: 'var(--wedding-primary)',
                    color: 'var(--wedding-primary)',
                  }}
                >
                  Update Response
                </Button>

                <Link href={`/${wedding.wedding.slug}`} className="block">
                  <Button
                    variant="ghost"
                    className="w-full flex items-center justify-center gap-2"
                    style={{ color: 'var(--wedding-primary)' }}
                  >
                    Explore Wedding Details & Programme
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <p
          className="text-xs text-center mt-8"
          style={{ color: 'var(--wedding-foreground)', opacity: 0.4 }}
        >
          This is your personal invitation
        </p>
      </div>

      {/* Floating Audio Player */}
      {wedding.settings.enableBackgroundMusic && wedding.settings.audioUrl && (
        <AudioPlayer audioUrl={wedding.settings.audioUrl} />
      )}
    </div>
  );
}

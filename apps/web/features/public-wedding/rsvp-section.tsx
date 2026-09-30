'use client';

import { useState } from 'react';
import { Search, CheckCircle2, XCircle } from 'lucide-react';
import { Button, Input } from '@everafter/ui';
import { API_URL } from '@/lib/api-client';

interface RsvpSectionProps {
  slug: string;
  layout?: string;
}

type Step = 'search' | 'form' | 'confirmed';

interface GuestMatch {
  id: string;
  firstName: string;
  lastName: string;
  rsvpStatus: string | null;
  companionCount: number;
  mealPreference: string | null;
  notes: string | null;
}

export function RsvpSection({ slug, layout }: RsvpSectionProps) {
  const [step, setStep] = useState<Step>('search');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guest, setGuest] = useState<GuestMatch | null>(null);
  const [rsvpStatus, setRsvpStatus] = useState<'ACCEPTED' | 'DECLINED'>('ACCEPTED');
  const [companionCount, setCompanionCount] = useState(0);
  const [mealPreference, setMealPreference] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      setError('Please enter both first and last name.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ firstName: firstName.trim(), lastName: lastName.trim() });
      const res = await fetch(`${API_URL}/public/weddings/${slug}/guests/search?${params}`);
      const body = await res.json();
      if (!res.ok) {
        setError(body.error?.message ?? 'Something went wrong');
        return;
      }
      const guests: GuestMatch[] = body.data;
      if (guests.length === 0) {
        setError('We couldn\u2019t find your name on the guest list. Please check your spelling or contact the couple.');
        return;
      }
      const found = guests[0];
      setGuest(found);
      // Pre-fill form with existing RSVP data
      if (found.rsvpStatus === 'ACCEPTED' || found.rsvpStatus === 'DECLINED') {
        setRsvpStatus(found.rsvpStatus);
      }
      setCompanionCount(found.companionCount);
      setMealPreference(found.mealPreference ?? '');
      setNotes(found.notes ?? '');
      setStep('form');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!guest) return;
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/public/weddings/${slug}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: guest.firstName,
          lastName: guest.lastName,
          status: rsvpStatus,
          companionCount: rsvpStatus === 'ACCEPTED' ? companionCount : 0,
          mealPreference: rsvpStatus === 'ACCEPTED' ? mealPreference || undefined : undefined,
          notes: notes || undefined,
        }),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error?.message ?? 'Something went wrong');
        return;
      }
      setStep('confirmed');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      id="rsvp"
      className={
        layout === 'editorial'
          ? 'px-8 md:px-20 py-20 md:py-32'
          : layout === 'magazine'
            ? 'px-8 md:px-16 py-16 md:py-24'
            : 'px-6 py-20 md:py-28'
      }
    >
      <div className={
        layout === 'editorial'
          ? 'max-w-md'
          : layout === 'magazine'
            ? 'max-w-md'
            : 'mx-auto max-w-md text-center'
      }>
        {layout === 'editorial' ? (
          <>
            <p
              className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] mb-6"
              style={{ color: 'var(--wedding-primary)' }}
            >
              RSVP
            </p>
            <h2
              className="text-3xl md:text-4xl font-serif font-medium tracking-tight mb-3"
              style={{ color: 'var(--wedding-foreground)' }}
            >
              Will you attend?
            </h2>
          </>
        ) : layout === 'magazine' ? (
          <>
            <h2
              className="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-4"
              style={{ color: 'var(--wedding-foreground)' }}
            >
              RSVP
            </h2>
            <div
              className="h-0.5 w-16 mb-6"
              style={{ backgroundColor: 'var(--wedding-primary)' }}
            />
          </>
        ) : (
          <h2
            className="text-3xl md:text-4xl font-serif font-medium tracking-tight mb-3"
            style={{ color: 'var(--wedding-foreground)' }}
          >
            RSVP
          </h2>
        )}
        <p className="text-sm mb-10" style={{ color: 'var(--wedding-foreground)', opacity: 0.6 }}>
          Please let us know if you can make it
        </p>

        {step === 'search' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Input
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            {error && <p className="text-sm text-error">{error}</p>}
            <Button
              onClick={handleSearch}
              disabled={isLoading}
              className="w-full"
              style={{ backgroundColor: 'var(--wedding-primary)', color: '#fff' }}
            >
              <Search className="h-4 w-4 mr-1.5" />
              {isLoading ? 'Searching...' : 'Find My Name'}
            </Button>
          </div>
        )}

        {step === 'form' && guest && (
          <div className="space-y-6 text-left">
            <p className="text-center text-sm" style={{ color: 'var(--wedding-foreground)', opacity: 0.7 }}>
              Hello, <span className="font-semibold">{guest.firstName} {guest.lastName}</span>!
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setRsvpStatus('ACCEPTED')}
                className="flex-1 rounded-lg border-2 py-4 text-center text-sm font-medium transition-colors"
                style={{
                  borderColor: rsvpStatus === 'ACCEPTED' ? 'var(--wedding-primary)' : 'var(--wedding-secondary)',
                  backgroundColor: rsvpStatus === 'ACCEPTED' ? 'var(--wedding-primary)' : 'transparent',
                  color: rsvpStatus === 'ACCEPTED' ? '#fff' : 'var(--wedding-foreground)',
                }}
              >
                <CheckCircle2 className="h-5 w-5 mx-auto mb-1" />
                Joyfully Accept
              </button>
              <button
                onClick={() => setRsvpStatus('DECLINED')}
                className="flex-1 rounded-lg border-2 py-4 text-center text-sm font-medium transition-colors"
                style={{
                  borderColor: rsvpStatus === 'DECLINED' ? 'var(--wedding-primary)' : 'var(--wedding-secondary)',
                  backgroundColor: rsvpStatus === 'DECLINED' ? 'var(--wedding-primary)' : 'transparent',
                  color: rsvpStatus === 'DECLINED' ? '#fff' : 'var(--wedding-foreground)',
                }}
              >
                <XCircle className="h-5 w-5 mx-auto mb-1" />
                Regretfully Decline
              </button>
            </div>

            {rsvpStatus === 'ACCEPTED' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5"
                         style={{ color: 'var(--wedding-foreground)' }}>
                    Number of companions
                  </label>
                  <Input
                    type="number"
                    min={0}
                    max={10}
                    value={companionCount}
                    onChange={(e) => setCompanionCount(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5"
                         style={{ color: 'var(--wedding-foreground)' }}>
                    Meal preference / dietary requirements
                  </label>
                  <Input
                    placeholder="e.g. Vegetarian, no shellfish"
                    value={mealPreference}
                    onChange={(e) => setMealPreference(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1.5"
                     style={{ color: 'var(--wedding-foreground)' }}>
                Notes for the couple (optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="A message or song request..."
                className="flex w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              />
            </div>

            {error && <p className="text-sm text-error text-center">{error}</p>}

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => { setStep('search'); setGuest(null); setError(''); }} className="flex-1">
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1"
                style={{ backgroundColor: 'var(--wedding-primary)', color: '#fff' }}
              >
                {isLoading ? 'Submitting...' : 'Submit RSVP'}
              </Button>
            </div>
          </div>
        )}

        {step === 'confirmed' && (
          <div className="py-8">
            <CheckCircle2
              className="h-16 w-16 mx-auto mb-4"
              style={{ color: 'var(--wedding-primary)' }}
            />
            <h3
              className="text-2xl font-serif font-medium tracking-tight mb-2"
              style={{ color: 'var(--wedding-foreground)' }}
            >
              {rsvpStatus === 'ACCEPTED' ? 'See you there!' : 'We\u2019ll miss you!'}
            </h3>
            <p className="text-sm" style={{ color: 'var(--wedding-foreground)', opacity: 0.6 }}>
              {rsvpStatus === 'ACCEPTED'
                ? 'Your response has been recorded. We can\u2019t wait to celebrate with you!'
                : 'Your response has been recorded. We hope to see you at a future celebration.'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

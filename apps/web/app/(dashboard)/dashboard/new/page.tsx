'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { Button, Input, Label } from '@everafter/ui';
import { useCreateWedding } from '@/lib/hooks/use-wedding-mutations';
import { useUpdateWeddingProfile } from '@/lib/hooks/use-wedding-mutations';
import { useWeddingContext } from '@/lib/wedding-context';
import { ApiError } from '@/lib/api-client';

const RESERVED_SLUGS = new Set([
  'login',
  'register',
  'dashboard',
  'forgot-password',
  'admin',
  'api',
  'settings',
  'about',
  'privacy',
  'terms',
  'help',
  'support',
  'new',
]);

const step1Schema = z.object({
  brideName: z.string().min(1, 'Bride name is required'),
  groomName: z.string().min(1, 'Groom name is required'),
  weddingDate: z.string().optional(),
  timezone: z.string(),
});

const step2Schema = z.object({
  ceremonyName: z.string().optional(),
  ceremonyAddress: z.string().optional(),
  receptionName: z.string().optional(),
  receptionAddress: z.string().optional(),
});

const step3Schema = z.object({
  weddingHashtag: z.string().optional(),
  dressCode: z.string().optional(),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;
type Step3Data = z.infer<typeof step3Schema>;

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="mb-1.5 block">{label}</Label>
      {children}
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  );
}

const steps = ['Basics', 'Venues', 'Details'];

export default function NewWeddingPage() {
  const router = useRouter();
  const createWedding = useCreateWedding();
  const { setActiveWedding } = useWeddingContext();
  const [step, setStep] = useState(0);
  const [globalError, setGlobalError] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Store data across steps
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);
  const [step2Data, setStep2Data] = useState<Step2Data | null>(null);

  const form1 = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      brideName: '',
      groomName: '',
      weddingDate: '',
      timezone: 'Asia/Manila',
    },
  });

  const form2 = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      ceremonyName: '',
      ceremonyAddress: '',
      receptionName: '',
      receptionAddress: '',
    },
  });

  const form3 = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      weddingHashtag: '',
      dressCode: '',
    },
  });

  const handleStep1Next = form1.handleSubmit((data) => {
    setStep1Data(data);
    setStep(1);
  });

  const handleStep2Next = form2.handleSubmit((data) => {
    setStep2Data(data);
    setStep(2);
  });

  const handleFinish = form3.handleSubmit(async (step3) => {
    if (!step1Data) return;
    setIsCreating(true);
    setGlobalError('');

    try {
      const title = `${step1Data.brideName} & ${step1Data.groomName}'s Wedding`;
      const wedding = await createWedding.mutateAsync({
        title,
        weddingDate: step1Data.weddingDate || undefined,
        timezone: step1Data.timezone,
      });

      // Now update profile with couple details + venues + step3
      const profileUpdate = new UseProfileUpdater(wedding.id);
      await profileUpdate.update({
        brideName: step1Data.brideName,
        groomName: step1Data.groomName,
        ceremonyName: step2Data?.ceremonyName || undefined,
        ceremonyAddress: step2Data?.ceremonyAddress || undefined,
        receptionName: step2Data?.receptionName || undefined,
        receptionAddress: step2Data?.receptionAddress || undefined,
        weddingHashtag: step3.weddingHashtag || undefined,
        dressCode: step3.dressCode || undefined,
      });

      setActiveWedding(wedding);
      router.push(`/dashboard/${wedding.id}`);
    } catch (err) {
      if (err instanceof ApiError) {
        setGlobalError(err.message);
      } else {
        setGlobalError('Something went wrong. Please try again.');
      }
      setIsCreating(false);
    }
  });

  return (
    <div className="mx-auto max-w-lg py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mx-auto mb-4">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          Create Your Wedding
        </h1>
        <p className="text-sm text-muted mt-1">
          Let&apos;s set up your wedding workspace
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium ${
                i <= step ? 'bg-primary text-white' : 'bg-border text-muted'
              }`}
            >
              {i + 1}
            </div>
            <span
              className={`text-xs hidden sm:inline ${i <= step ? 'text-foreground' : 'text-muted'}`}
            >
              {s}
            </span>
            {i < steps.length - 1 && (
              <div
                className={`h-px w-8 ${i < step ? 'bg-primary' : 'bg-border'}`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="rounded-lg border border-border bg-surface p-6">
        {step === 0 && (
          <form onSubmit={handleStep1Next} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Bride's Name"
                error={form1.formState.errors.brideName?.message}
              >
                <Input
                  {...form1.register('brideName')}
                  placeholder="e.g. Issa"
                  error={!!form1.formState.errors.brideName}
                  autoFocus
                />
              </FormField>
              <FormField
                label="Groom's Name"
                error={form1.formState.errors.groomName?.message}
              >
                <Input
                  {...form1.register('groomName')}
                  placeholder="e.g. Michael"
                  error={!!form1.formState.errors.groomName}
                />
              </FormField>
            </div>

            <FormField label="Wedding Date">
              <Input {...form1.register('weddingDate')} type="date" />
            </FormField>

            <FormField label="Timezone">
              <select
                {...form1.register('timezone')}
                className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <option value="Asia/Manila">Asia/Manila (PHT)</option>
                <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
                <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                <option value="America/New_York">America/New_York (ET)</option>
                <option value="America/Los_Angeles">
                  America/Los_Angeles (PT)
                </option>
                <option value="Europe/London">Europe/London (GMT)</option>
              </select>
            </FormField>

            <div className="flex justify-end pt-2">
              <Button type="submit">
                Next <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </div>
          </form>
        )}

        {step === 1 && (
          <form onSubmit={handleStep2Next} className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Ceremony
              </h3>
              <div className="space-y-3">
                <FormField label="Venue Name">
                  <Input
                    {...form2.register('ceremonyName')}
                    placeholder="e.g. Manila Cathedral"
                  />
                </FormField>
                <FormField label="Address">
                  <Input
                    {...form2.register('ceremonyAddress')}
                    placeholder="e.g. Intramuros, Manila"
                  />
                </FormField>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Reception
              </h3>
              <div className="space-y-3">
                <FormField label="Venue Name">
                  <Input
                    {...form2.register('receptionName')}
                    placeholder="e.g. Shangri-La at the Fort"
                  />
                </FormField>
                <FormField label="Address">
                  <Input
                    {...form2.register('receptionAddress')}
                    placeholder="e.g. BGC, Taguig"
                  />
                </FormField>
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(0)}
              >
                <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
              </Button>
              <Button type="submit">
                Next <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleFinish} className="space-y-4">
            <FormField label="Wedding Hashtag">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">
                  #
                </span>
                <Input
                  {...form3.register('weddingHashtag')}
                  placeholder="MichaelAndIssaForever"
                  className="pl-7"
                />
              </div>
            </FormField>

            <FormField label="Dress Code">
              <Input
                {...form3.register('dressCode')}
                placeholder="e.g. Semi-formal, Earth tones"
              />
            </FormField>

            {globalError && (
              <p className="text-sm text-error text-center">{globalError}</p>
            )}

            <div className="flex justify-between pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
              >
                <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
              </Button>
              <Button type="submit" disabled={isCreating}>
                <Sparkles className="h-4 w-4 mr-1.5" />
                {isCreating ? 'Creating...' : 'Create Wedding'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// Helper class to call profile update after wedding creation
class UseProfileUpdater {
  constructor(private weddingId: string) {}

  async update(data: Record<string, string | undefined>) {
    const { apiFetch } = await import('@/lib/api-client');
    await apiFetch(`/weddings/${this.weddingId}/profile`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
}

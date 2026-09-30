'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Plus, X, Upload, Trash2, Image } from 'lucide-react';
import { toast } from 'sonner';
import { Button, Input, Label } from '@everafter/ui';
import { useWeddingProfile } from '@/lib/hooks/use-dashboard';
import { useWedding } from '@/lib/hooks/use-weddings';
import {
  useUpdateWeddingProfile,
  useUpdateWedding,
  useUploadVenueImage,
} from '@/lib/hooks/use-wedding-mutations';
import { DressCodeCouples } from '@/features/public-wedding/dress-code-couples';
import { AddressSearchInput } from '@/features/public-wedding/address-search-input';
import { resolveUploadUrl } from '@/lib/api-client';

/** Extract "HH:mm" from an ISO date string for <input type="time"> */
function toTimeValue(iso: string | null | undefined): string {
  if (!iso) return '';
  // Already bare time like "14:30"
  if (/^\d{2}:\d{2}$/.test(iso)) return iso;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toISOString().slice(11, 16);
}

const profileSchema = z.object({
  weddingDate: z.string().optional(),
  brideName: z.string().optional(),
  groomName: z.string().optional(),
  weddingHashtag: z.string().optional(),
  ceremonyName: z.string().optional(),
  ceremonyAddress: z.string().optional(),
  ceremonyTime: z.string().optional(),
  receptionName: z.string().optional(),
  receptionAddress: z.string().optional(),
  receptionTime: z.string().optional(),
  loveStory: z.string().optional(),
  proposalStory: z.string().optional(),
  dressCode: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

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

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <h2 className="text-base font-semibold text-foreground mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const { weddingId } = useParams<{ weddingId: string }>();
  const { data: wedding, isLoading: isWeddingLoading } = useWedding(weddingId);
  const { data: profile, isLoading: isProfileLoading } = useWeddingProfile(weddingId);
  const isLoading = isWeddingLoading || isProfileLoading;
  const updateProfile = useUpdateWeddingProfile(weddingId);
  const updateWedding = useUpdateWedding(weddingId);
  const [dressCodeColors, setDressCodeColors] = useState<string[]>([
    '#2C3E50',
    '#8B5E5E',
    '#D4A574',
  ]);
  const [colorsChanged, setColorsChanged] = useState(false);
  const uploadCeremonyImage = useUploadVenueImage(weddingId, 'ceremony');
  const uploadReceptionImage = useUploadVenueImage(weddingId, 'reception');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      weddingDate: '',
      brideName: '',
      groomName: '',
      weddingHashtag: '',
      ceremonyName: '',
      ceremonyAddress: '',
      ceremonyTime: '',
      receptionName: '',
      receptionAddress: '',
      receptionTime: '',
      loveStory: '',
      proposalStory: '',
      dressCode: '',
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        weddingDate: wedding?.weddingDate
          ? new Date(wedding.weddingDate).toISOString().slice(0, 10)
          : '',
        brideName: profile.brideName ?? '',
        groomName: profile.groomName ?? '',
        weddingHashtag: profile.weddingHashtag ?? '',
        ceremonyName: profile.ceremonyName ?? '',
        ceremonyAddress: profile.ceremonyAddress ?? '',
        ceremonyTime: toTimeValue(profile.ceremonyTime),
        receptionName: profile.receptionName ?? '',
        receptionAddress: profile.receptionAddress ?? '',
        receptionTime: toTimeValue(profile.receptionTime),
        loveStory: profile.loveStory ?? '',
        proposalStory: profile.proposalStory ?? '',
        dressCode: profile.dressCode ?? '',
      });
      if (profile.dressCodeColors?.length) {
        setDressCodeColors(profile.dressCodeColors);
      }
    }
  }, [profile, wedding, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile.mutateAsync({
        brideName: data.brideName || null,
        groomName: data.groomName || null,
        weddingHashtag: data.weddingHashtag || null,
        ceremonyName: data.ceremonyName || null,
        ceremonyAddress: data.ceremonyAddress || null,
        ceremonyTime: data.ceremonyTime || null,
        receptionName: data.receptionName || null,
        receptionAddress: data.receptionAddress || null,
        receptionTime: data.receptionTime || null,
        loveStory: data.loveStory || null,
        proposalStory: data.proposalStory || null,
        dressCode: data.dressCode || null,
        dressCodeColors: dressCodeColors.length > 0 ? dressCodeColors : null,
      });
      setColorsChanged(false);

      // Update wedding-level fields (title, date)
      const weddingUpdates: Record<string, unknown> = {};
      if (data.brideName && data.groomName) {
        weddingUpdates.title = `${data.brideName} & ${data.groomName}'s Wedding`;
      }
      if (data.weddingDate) {
        weddingUpdates.weddingDate = new Date(data.weddingDate).toISOString();
      } else {
        weddingUpdates.weddingDate = null;
      }
      if (Object.keys(weddingUpdates).length > 0) {
        await updateWedding.mutateAsync(weddingUpdates);
      }

      toast.success('Settings saved successfully');
    } catch {
      toast.error('Failed to save settings');
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 max-w-3xl">
        <div className="h-8 w-48 rounded bg-border animate-pulse" />
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-lg border border-border bg-surface p-6 space-y-4"
          >
            <div className="h-5 w-32 rounded bg-border animate-pulse" />
            <div className="h-10 w-full rounded bg-border animate-pulse" />
            <div className="h-10 w-full rounded bg-border animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Wedding Settings
          </h1>
          <p className="text-sm text-muted mt-1">
            Update your wedding profile details
          </p>
        </div>
        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={(!isDirty && !colorsChanged) || updateProfile.isPending}
        >
          <Save className="h-4 w-4 mr-1.5" />
          {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Section title="Couple Details">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Bride's Name" error={errors.brideName?.message}>
              <Input {...register('brideName')} placeholder="e.g. Issa" />
            </FormField>
            <FormField label="Groom's Name" error={errors.groomName?.message}>
              <Input {...register('groomName')} placeholder="e.g. Michael" />
            </FormField>
          </div>
          <FormField label="Wedding Date" error={errors.weddingDate?.message}>
            <Input {...register('weddingDate')} type="date" />
          </FormField>
          <FormField
            label="Wedding Hashtag"
            error={errors.weddingHashtag?.message}
          >
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">
                #
              </span>
              <Input
                {...register('weddingHashtag')}
                placeholder="MichaelAndIssaForever"
                className="pl-7"
              />
            </div>
          </FormField>
          <FormField label="Dress Code" error={errors.dressCode?.message}>
            <Input
              {...register('dressCode')}
              placeholder="e.g. Semi-formal, Earth tones"
            />
          </FormField>
          <div>
            <Label className="mb-1.5 block">Dress Code Colors</Label>
            <p className="text-xs text-muted mb-3">
              Choose colors to display on the couple illustrations in the dress code section
            </p>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {dressCodeColors.map((color, i) => (
                <div key={i} className="flex items-center gap-2">
                  <label
                    className="relative h-10 w-10 rounded-lg border-2 border-border cursor-pointer overflow-hidden"
                    title={`Color ${i + 1}`}
                  >
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => {
                        const next = [...dressCodeColors];
                        next[i] = e.target.value;
                        setDressCodeColors(next);
                        setColorsChanged(true);
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div
                      className="h-full w-full"
                      style={{ backgroundColor: color }}
                    />
                  </label>
                  {dressCodeColors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        setDressCodeColors(dressCodeColors.filter((_, j) => j !== i));
                        setColorsChanged(true);
                      }}
                      className="text-muted hover:text-error transition-colors"
                      title="Remove color"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
              {dressCodeColors.length < 6 && (
                <button
                  type="button"
                  onClick={() => {
                    setDressCodeColors([...dressCodeColors, '#888888']);
                    setColorsChanged(true);
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-dashed border-border text-muted hover:border-primary hover:text-primary transition-colors"
                  title="Add color"
                >
                  <Plus className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-xs text-muted mb-3 text-center">Preview</p>
              <DressCodeCouples
                colors={dressCodeColors}
                primaryColor="#8B5E5E"
              />
            </div>
          </div>
        </Section>

        <Section title="Ceremony Venue">
          <FormField label="Venue Name" error={errors.ceremonyName?.message}>
            <Input
              {...register('ceremonyName')}
              placeholder="e.g. Manila Cathedral"
            />
          </FormField>
          <div>
            <Label className="mb-1.5 block">Address</Label>
            <AddressSearchInput
              value={watch('ceremonyAddress') ?? ''}
              onChange={(addr) => setValue('ceremonyAddress', addr, { shouldDirty: true })}
              placeholder="Search for ceremony venue..."
            />
            {errors.ceremonyAddress?.message && (
              <p className="mt-1 text-xs text-error">{errors.ceremonyAddress.message}</p>
            )}
          </div>
          <FormField label="Time" error={errors.ceremonyTime?.message}>
            <Input {...register('ceremonyTime')} type="time" />
          </FormField>
          <div>
            <Label className="mb-1.5 block">Venue Image</Label>
            {profile?.ceremonyImage ? (
              <div className="relative group w-full h-40 rounded-lg overflow-hidden border border-border">
                <img
                  src={resolveUploadUrl(profile.ceremonyImage)!}
                  alt="Ceremony venue"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-md text-xs font-medium text-foreground hover:bg-gray-100 transition-colors">
                    <Upload className="h-3.5 w-3.5" />
                    Replace
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          uploadCeremonyImage.mutate(file, {
                            onSuccess: () => toast.success('Ceremony image uploaded'),
                            onError: () => toast.error('Failed to upload image'),
                          });
                        }
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      updateProfile.mutate(
                        { ceremonyImage: null },
                        {
                          onSuccess: () => toast.success('Image removed'),
                          onError: () => toast.error('Failed to remove image'),
                        },
                      );
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-md text-xs font-medium text-error hover:bg-gray-100 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 rounded-lg border-2 border-dashed border-border hover:border-primary cursor-pointer transition-colors">
                <Image className="h-6 w-6 text-muted mb-2" />
                <span className="text-xs text-muted">Click to upload venue image</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      uploadCeremonyImage.mutate(file, {
                        onSuccess: () => toast.success('Ceremony image uploaded'),
                        onError: () => toast.error('Failed to upload image'),
                      });
                    }
                  }}
                />
              </label>
            )}
          </div>
        </Section>

        <Section title="Reception Venue">
          <FormField label="Venue Name" error={errors.receptionName?.message}>
            <Input
              {...register('receptionName')}
              placeholder="e.g. Shangri-La at the Fort"
            />
          </FormField>
          <div>
            <Label className="mb-1.5 block">Address</Label>
            <AddressSearchInput
              value={watch('receptionAddress') ?? ''}
              onChange={(addr) => setValue('receptionAddress', addr, { shouldDirty: true })}
              placeholder="Search for reception venue..."
            />
            {errors.receptionAddress?.message && (
              <p className="mt-1 text-xs text-error">{errors.receptionAddress.message}</p>
            )}
          </div>
          <FormField label="Time" error={errors.receptionTime?.message}>
            <Input {...register('receptionTime')} type="time" />
          </FormField>
          <div>
            <Label className="mb-1.5 block">Venue Image</Label>
            {profile?.receptionImage ? (
              <div className="relative group w-full h-40 rounded-lg overflow-hidden border border-border">
                <img
                  src={resolveUploadUrl(profile.receptionImage)!}
                  alt="Reception venue"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-md text-xs font-medium text-foreground hover:bg-gray-100 transition-colors">
                    <Upload className="h-3.5 w-3.5" />
                    Replace
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          uploadReceptionImage.mutate(file, {
                            onSuccess: () => toast.success('Reception image uploaded'),
                            onError: () => toast.error('Failed to upload image'),
                          });
                        }
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      updateProfile.mutate(
                        { receptionImage: null },
                        {
                          onSuccess: () => toast.success('Image removed'),
                          onError: () => toast.error('Failed to remove image'),
                        },
                      );
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-md text-xs font-medium text-error hover:bg-gray-100 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 rounded-lg border-2 border-dashed border-border hover:border-primary cursor-pointer transition-colors">
                <Image className="h-6 w-6 text-muted mb-2" />
                <span className="text-xs text-muted">Click to upload venue image</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      uploadReceptionImage.mutate(file, {
                        onSuccess: () => toast.success('Reception image uploaded'),
                        onError: () => toast.error('Failed to upload image'),
                      });
                    }
                  }}
                />
              </label>
            )}
          </div>
        </Section>

        <Section title="Your Story">
          <FormField label="Love Story" error={errors.loveStory?.message}>
            <textarea
              {...register('loveStory')}
              rows={4}
              placeholder="How did you two meet?"
              className="flex w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            />
          </FormField>
          <FormField
            label="Proposal Story"
            error={errors.proposalStory?.message}
          >
            <textarea
              {...register('proposalStory')}
              rows={4}
              placeholder="How did the proposal happen?"
              className="flex w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            />
          </FormField>
        </Section>

        <div className="flex justify-end pb-6">
          <Button type="submit" disabled={(!isDirty && !colorsChanged) || updateProfile.isPending}>
            <Save className="h-4 w-4 mr-1.5" />
            {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}

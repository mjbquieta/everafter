'use client';

import { useState, useRef } from 'react';
import { Music, Play, Pause, Upload, X, Loader2 } from 'lucide-react';
import { Label, Input, Button } from '@everafter/ui';
import { toast } from 'sonner';
import { useUploadAudio } from '@/lib/hooks/use-website-settings';
import { resolveUploadUrl } from '@/lib/api-client';

interface AudioSettingsProps {
  weddingId: string;
  enableBackgroundMusic: boolean;
  audioUrl: string | null;
  onEnableChange: (enabled: boolean) => void;
  onAudioUrlChange: (url: string) => void;
}

const PRESET_TRACKS = [
  {
    value: '',
    label: 'None',
  },
  {
    value: '/audio/ceremony-walk.mp3',
    label: 'Ceremony Walk',
  },
  {
    value: '/audio/leberch-wedding.mp3',
    label: 'Leberch Romance',
  },
  {
    value: '/audio/andriig-wedding-wedding.mp3',
    label: 'Golden Glow',
  },
];

export function AudioSettings({
  weddingId,
  enableBackgroundMusic,
  audioUrl,
  onEnableChange,
  onAudioUrlChange,
}: AudioSettingsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewAudioRef = useRef<HTMLAudioElement>(null);
  const upload = useUploadAudio(weddingId);

  const [useCustomUrl, setUseCustomUrl] = useState(
    !!audioUrl && !PRESET_TRACKS.some((t) => t.value === audioUrl),
  );
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);

  const isUploadedFile = audioUrl && audioUrl.startsWith('uploads/');
  const isPreset = audioUrl && PRESET_TRACKS.some((t) => t.value === audioUrl);

  // Use direct URL for presets and external URLs, resolve only for uploads
  const audioSrc = audioUrl
    ? isPreset || audioUrl.startsWith('http') || audioUrl.startsWith('/audio/')
      ? audioUrl
      : resolveUploadUrl(audioUrl)
    : null;

  const handlePresetChange = (value: string) => {
    setUseCustomUrl(false);
    onAudioUrlChange(value);
  };

  const handleCustomUrlChange = (value: string) => {
    setUseCustomUrl(true);
    onAudioUrlChange(value);
  };

  const handleFileUpload = async (file: File) => {
    if (!['audio/mpeg', 'audio/mp3', 'audio/wav'].includes(file.type)) {
      toast.error('Only MP3 and WAV files are allowed');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File must be smaller than 10MB');
      return;
    }

    try {
      const result = await upload.mutateAsync(file);
      onAudioUrlChange((result as any).audioUrl || '');
      setUseCustomUrl(false);
      toast.success('Audio uploaded successfully');
    } catch {
      toast.error('Failed to upload audio');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
    e.target.value = '';
  };

  const handleRemoveUpload = () => {
    onAudioUrlChange('');
  };

  const togglePreview = async () => {
    if (!previewAudioRef.current || !audioSrc) return;

    if (isPreviewPlaying) {
      previewAudioRef.current.pause();
      previewAudioRef.current.currentTime = 0;
      setIsPreviewPlaying(false);
    } else {
      try {
        await previewAudioRef.current.play();
        setIsPreviewPlaying(true);
      } catch (error) {
        console.error('Preview playback failed:', error);
        toast.error('Failed to play audio');
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Music className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Ambient Music</h3>
      </div>

      {/* Enable Toggle */}
      <div className="flex items-center justify-between">
        <Label className="text-sm text-muted">Background music</Label>
        <button
          onClick={() => onEnableChange(!enableBackgroundMusic)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            enableBackgroundMusic ? 'bg-primary' : 'bg-border'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              enableBackgroundMusic ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {enableBackgroundMusic && (
        <>
          {/* Preset Selection */}
          <div>
            <Label className="mb-2 block text-xs text-muted">
              Preset Track
            </Label>
            <select
              value={isPreset ? audioUrl || '' : ''}
              onChange={(e) => handlePresetChange(e.target.value)}
              disabled={upload.isPending}
              className="w-full h-9 rounded-md border border-border bg-surface px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50"
            >
              {PRESET_TRACKS.map((track) => (
                <option key={track.value} value={track.value}>
                  {track.label}
                </option>
              ))}
            </select>
          </div>

          {/* File Upload */}
          <div>
            <Label className="mb-2 block text-xs text-muted">
              Upload Custom Audio
            </Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/mp3,audio/mpeg,audio/wav"
              onChange={handleInputChange}
              className="hidden"
            />
            {isUploadedFile ? (
              <div className="flex items-center gap-2 p-2 rounded-md border border-border bg-surface">
                <Music className="h-4 w-4 text-muted shrink-0" />
                <span className="text-xs text-foreground flex-1 truncate">
                  {audioUrl.split('/').pop()}
                </span>
                <button
                  onClick={handleRemoveUpload}
                  className="p-1 text-stone-500 hover:text-error transition-colors"
                  aria-label="Remove audio"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={upload.isPending}
                className="w-full text-xs"
              >
                {upload.isPending ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-3.5 w-3.5 mr-1.5" />
                    Upload MP3/WAV (max 10MB)
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Custom URL */}
          <div>
            <Label className="mb-2 block text-xs text-muted">
              Or External URL
            </Label>
            <Input
              type="url"
              placeholder="https://example.com/audio.mp3"
              value={useCustomUrl ? audioUrl || '' : ''}
              onChange={(e) => handleCustomUrlChange(e.target.value)}
              disabled={upload.isPending}
              className="text-sm"
            />
          </div>

          {/* Preview Button */}
          {audioSrc && (
            <button
              onClick={togglePreview}
              disabled={upload.isPending}
              className="flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 transition-colors disabled:opacity-50"
            >
              {isPreviewPlaying ? (
                <>
                  <Pause className="h-4 w-4" />
                  Stop Preview
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Preview Track
                </>
              )}
            </button>
          )}

          {/* Hidden Preview Audio */}
          <audio
            ref={previewAudioRef}
            src={audioSrc || undefined}
            onEnded={() => setIsPreviewPlaying(false)}
          />
        </>
      )}
    </div>
  );
}

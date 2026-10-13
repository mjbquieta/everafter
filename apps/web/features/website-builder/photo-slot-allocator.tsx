'use client';

import { useState } from 'react';
import { ImagePlus, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@everafter/ui';
import { getTemplateBlueprint } from './template-blueprints';
import { resolveUploadUrl } from '@/lib/api-client';

interface PhotoSlotAllocatorProps {
  templateId: string;
  layoutSlots: Record<string, string>;
  availablePhotos: Array<{ id: string; url: string; caption?: string | null }>;
  onSlotUpdate: (slotId: string, photoUrl: string | null) => void;
  onUploadClick: () => void;
}

export function PhotoSlotAllocator({
  templateId,
  layoutSlots,
  availablePhotos,
  onSlotUpdate,
  onUploadClick,
}: PhotoSlotAllocatorProps) {
  const [expanded, setExpanded] = useState(true);
  const [selectingSlot, setSelectingSlot] = useState<string | null>(null);

  const blueprint = getTemplateBlueprint(templateId);
  if (!blueprint) return null;

  const handleSelectPhoto = (slotId: string, photoUrl: string) => {
    onSlotUpdate(slotId, photoUrl);
    setSelectingSlot(null);
  };

  return (
    <div className="space-y-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <h3 className="text-sm font-semibold text-foreground">Photo Slots</h3>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-muted" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted" />
        )}
      </button>

      {expanded && (
        <div className="space-y-2">
          {blueprint.slots.map((slot, index) => {
            const assignedUrl = layoutSlots[slot.id];
            const resolvedUrl = resolveUploadUrl(assignedUrl);

            return (
              <div
                key={slot.id}
                className={`rounded-lg border p-3 ${
                  slot.optional
                    ? 'border-stone-200 bg-stone-50/50'
                    : 'border-stone-200 bg-white'
                }`}
              >
                {/* Slot Header */}
                <div className="flex items-start gap-2 mb-2">
                  <div
                    className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                    style={{
                      backgroundColor: slot.optional ? '#d6d3d1' : '#292524',
                      color: '#fff',
                    }}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-stone-900 leading-tight">
                      {slot.name}
                      {slot.optional && (
                        <span className="ml-1.5 text-[10px] font-normal text-stone-500">
                          (Optional)
                        </span>
                      )}
                    </p>
                    <p className="text-[10px] text-stone-500 mt-0.5">
                      {slot.aspectRatio} · {slot.placement}
                    </p>
                  </div>
                </div>

                {/* Photo Preview or Empty State */}
                {resolvedUrl ? (
                  <div className="relative group">
                    <div className="aspect-video w-full rounded overflow-hidden bg-stone-100 border border-stone-200">
                      <img
                        src={resolvedUrl}
                        alt={slot.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => onSlotUpdate(slot.id, null)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-stone-900/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove photo"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectingSlot(slot.id)}
                    className="w-full aspect-video rounded border-2 border-dashed border-stone-300 bg-stone-50 hover:bg-stone-100 hover:border-stone-400 transition-colors flex flex-col items-center justify-center gap-1.5 group"
                  >
                    <ImagePlus className="h-5 w-5 text-stone-400 group-hover:text-stone-600 transition-colors" />
                    <span className="text-[10px] font-medium text-stone-500 group-hover:text-stone-700">
                      Add Photo
                    </span>
                  </button>
                )}

                {/* Photo Picker Modal */}
                {selectingSlot === slot.id && (
                  <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
                      {/* Header */}
                      <div className="flex items-center justify-between p-4 border-b border-stone-200">
                        <div>
                          <h3 className="text-sm font-semibold text-stone-900">
                            Choose Photo for {slot.name}
                          </h3>
                          <p className="text-xs text-stone-500 mt-0.5">
                            Select from your Website Photos
                          </p>
                        </div>
                        <button
                          onClick={() => setSelectingSlot(null)}
                          className="p-1 hover:bg-stone-100 rounded transition-colors"
                        >
                          <X className="h-4 w-4 text-stone-600" />
                        </button>
                      </div>

                      {/* Photo Grid */}
                      <div className="flex-1 overflow-y-auto p-4">
                        {availablePhotos.length === 0 ? (
                          <div className="text-center py-12">
                            <p className="text-sm text-stone-500 mb-4">
                              No photos available yet
                            </p>
                            <Button onClick={onUploadClick} size="sm">
                              <ImagePlus className="h-3.5 w-3.5 mr-1.5" />
                              Upload Photos
                            </Button>
                          </div>
                        ) : (
                          <div className="grid grid-cols-3 gap-3">
                            {availablePhotos.map((photo) => (
                              <button
                                key={photo.id}
                                onClick={() => handleSelectPhoto(slot.id, photo.url)}
                                className="aspect-square rounded overflow-hidden bg-stone-100 border-2 border-transparent hover:border-primary transition-colors"
                              >
                                <img
                                  src={resolveUploadUrl(photo.url) || ''}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

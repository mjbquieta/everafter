'use client';

import { X, Download } from 'lucide-react';
import { Button } from '@everafter/ui';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';

interface QRGeneratorModalProps {
  open: boolean;
  onClose: () => void;
  slug: string;
  brideName?: string | null;
  groomName?: string | null;
  weddingDate?: string | null;
}

export function QRGeneratorModal({
  open,
  onClose,
  slug,
  brideName,
  groomName,
  weddingDate,
}: QRGeneratorModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState('');

  const url = `${window.location.origin}/${slug}/memories`;
  const coupleNames =
    brideName && groomName ? `${brideName} & ${groomName}` : 'The Happy Couple';

  const formattedDate = weddingDate
    ? new Date(weddingDate).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  useEffect(() => {
    if (open) {
      QRCode.toDataURL(url, {
        width: 400,
        margin: 2,
        color: {
          dark: '#1C1917',
          light: '#FFFFFF',
        },
      }).then(setQrDataUrl);
    }
  }, [open, url]);

  const handlePrint = () => {
    window.print();
  };

  if (!open) return null;

  return (
    <>
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 no-print">
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />
        <div className="relative z-10 w-full max-w-md mx-auto">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute -top-2 -right-2 z-20 p-2 rounded-full bg-white shadow-lg text-stone-600 hover:text-stone-900 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Card Container */}
          <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
            {/* Header */}
            <div className="px-6 sm:px-8 pt-6 pb-4 text-center border-b border-stone-100">
              <h2 className="text-lg font-semibold text-stone-900 mb-1">
                Table QR Sign
              </h2>
              <p className="text-xs text-stone-500">
                Print and place on tables for guests to upload photos
              </p>
            </div>

            {/* Printable Card Preview */}
            <div className="p-6 sm:p-8">
              <PrintableCard
                qrDataUrl={qrDataUrl}
                coupleNames={coupleNames}
                formattedDate={formattedDate}
              />
            </div>

            {/* Footer Actions */}
            <div className="px-6 pb-6 flex justify-center">
              <Button onClick={handlePrint} className="w-full sm:w-auto">
                <Download className="h-4 w-4 mr-2" />
                Print Card
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Print-only full page */}
      <div className="print-only">
        <PrintableCard
          qrDataUrl={qrDataUrl}
          coupleNames={coupleNames}
          formattedDate={formattedDate}
        />
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-only,
          .print-only * {
            visibility: visible;
          }
          .print-only {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            max-width: 400px;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: 5in 7in;
            margin: 0.5in;
          }
        }
      `}</style>
    </>
  );
}

function PrintableCard({
  qrDataUrl,
  coupleNames,
  formattedDate,
}: {
  qrDataUrl: string;
  coupleNames: string;
  formattedDate: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-4">
      {/* Couple Names & Date */}
      <div>
        <h1 className="font-serif text-xl text-stone-900 mb-1">{coupleNames}</h1>
        {formattedDate && (
          <p className="text-xs text-stone-500 tracking-wider uppercase">
            {formattedDate}
          </p>
        )}
      </div>

      {/* Invitation Text */}
      <div className="space-y-1">
        <p className="font-serif text-base text-stone-900 italic">
          Share Your Perspective
        </p>
        <p className="text-sm text-stone-600">
          Scan to upload photos
        </p>
      </div>

      {/* QR Code */}
      {qrDataUrl && (
        <div className="w-48 h-48 sm:w-56 sm:h-56 mx-auto p-2 bg-white rounded-xl border border-stone-100 shadow-sm">
          <img src={qrDataUrl} alt="QR Code" className="w-full h-full" />
        </div>
      )}

      {/* Footer Instruction */}
      <p className="text-xs text-stone-400 max-w-xs leading-relaxed">
        Use your phone camera to scan and share photos directly with the couple
      </p>
    </div>
  );
}

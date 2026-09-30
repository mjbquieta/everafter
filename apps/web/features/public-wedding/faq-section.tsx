'use client';

import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  items: FaqItem[];
  layout?: string;
}

export function FaqSection({ items, layout }: FaqSectionProps) {
  if (!items.length) return null;

  const isMagazine = layout === 'magazine';
  const isEditorial = layout === 'editorial';

  return (
    <section id="faq" className="px-4 md:px-8 py-16 md:py-24">
      <div className={
        isEditorial
          ? 'mx-auto max-w-2xl'
          : isMagazine
            ? 'mx-auto max-w-2xl'
            : 'mx-auto max-w-xl'
      }>
        {isEditorial ? (
          <p
            className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] mb-6"
            style={{ color: 'var(--wedding-primary)' }}
          >
            FAQ
          </p>
        ) : isMagazine ? (
          <>
            <h2
              className="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-4"
              style={{ color: 'var(--wedding-foreground)' }}
            >
              FAQ
            </h2>
            <div
              className="h-0.5 w-16 mb-10"
              style={{ backgroundColor: 'var(--wedding-primary)' }}
            />
          </>
        ) : (
          <h2
            className="text-3xl md:text-4xl font-serif font-medium tracking-tight text-center mb-12"
            style={{ color: 'var(--wedding-foreground)' }}
          >
            Frequently Asked Questions
          </h2>
        )}

        <Accordion.Root type="single" collapsible className="space-y-0">
          {items.map((item, i) => (
            <Accordion.Item
              key={i}
              value={`faq-${i}`}
              className="border-b"
              style={{ borderColor: 'var(--wedding-secondary)' }}
            >
              <Accordion.Trigger
                className="group flex w-full items-center justify-between py-5 text-left transition-opacity hover:opacity-70"
              >
                <span
                  className={
                    isEditorial
                      ? 'text-lg md:text-xl font-serif font-medium pr-4'
                      : isMagazine
                        ? 'text-base font-sans font-semibold pr-4'
                        : 'text-base font-serif font-medium pr-4'
                  }
                  style={{ color: 'var(--wedding-foreground)' }}
                >
                  {item.question}
                </span>
                <ChevronDown
                  className="h-4 w-4 shrink-0 transition-transform duration-300 group-data-[state=open]:rotate-180"
                  style={{ color: 'var(--wedding-primary)' }}
                />
              </Accordion.Trigger>
              <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                <p
                  className="pb-5 text-sm leading-relaxed"
                  style={{ color: 'var(--wedding-foreground)', opacity: 0.7 }}
                >
                  {item.answer}
                </p>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}

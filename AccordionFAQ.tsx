"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { FaqItem } from "@/lib/data-store";

export default function AccordionFAQ({ items }: { items: FaqItem[] }) {
  return (
    <Accordion.Root type="single" collapsible className="space-y-3">
      {items.map((item) => (
        <Accordion.Item
          key={item.id}
          value={item.id}
          className="glass-card overflow-hidden rounded-xl"
        >
          <Accordion.Header>
            <Accordion.Trigger className="glow-ring group flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-white">
              {item.question}
              <ChevronDown
                size={16}
                className="shrink-0 text-violet-soft transition-transform duration-200 group-data-[state=open]:rotate-180"
              />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="accordion-content px-5 text-sm text-slate-400 data-[state=open]:pb-4">
            {item.answer}
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}

"use client";

import React from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { HelpCircle, Sparkles } from "lucide-react";

export default function FaqSection() {
  const faqs = [
    {
      question: "How does MomentGrid handle high-resolution RAW or large TIFF file deliveries?",
      answer:
        "MomentGrid uses enterprise-grade NVMe cloud storage backed by multi-region CDN caching. You can upload uncompressed JPEGs, TIFFs, or ZIP archives at full resolution. Clients can download individual high-res favorites or complete batch archives with zero compression loss or speed throttling.",
    },
    {
      question: "Can I use my own custom studio domain for client galleries and booking links?",
      answer:
        "Yes! On our Professional and Studio Enterprise plans, you can fully white-label your portal with CNAME custom domain mapping (e.g., portal.yourstudio.com). Your clients will see your logo, your curated brand colors, and your domain across all galleries and invoices.",
    },
    {
      question: "Do you charge any commission fees on client print orders or deposit payments?",
      answer:
        "Absolutely not. We believe 100% of your photography revenue belongs to you. We do not charge any commission or platform percentage on booking deposits, retainer invoices, or client print orders. You only pay standard processing fees directly to your connected Stripe account.",
    },
    {
      question: "How does the multi-photographer role and assignment system work?",
      answer:
        "As a Studio Owner, you can invite associate or second photographers to your workspace with role-based access control. Photographers can only view their assigned shoots, manage their own schedule, and upload deliverables to their designated galleries without seeing sensitive overall studio financial analytics.",
    },
    {
      question: "How secure are password-protected galleries and client PIN verification?",
      answer:
        "Every gallery created on MomentGrid generates a unique cryptographic share token. You can optionally require a custom 4-to-6 digit PIN code and set automated expiration dates. Downloads can also be restricted by email verification to ensure only authorized guests or family members can access private wedding albums.",
    },
    {
      question: "What happens if my studio exceeds its monthly cloud storage tier?",
      answer:
        "We will never cut off your client access or block active shoot deliveries during a busy wedding season. If you approach or exceed your storage limit, our system will notify you with a grace period where you can either archive older delivered sessions or upgrade your storage tier seamlessly.",
    },
  ];

  return (
    <section id="faq" className="py-24 bg-surface-1 text-textPalette-primary border-b border-borderColor">
      <div className="max-w-4xl mx-auto px-6 md:px-10">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-up">
          <Badge variant="gold" className="mb-4 px-3.5 py-1 text-xs tracking-wider uppercase">
            <Sparkles className="w-3 h-3 mr-1.5" /> COMMON QUESTIONS
          </Badge>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-textPalette-primary leading-tight mb-4">
            Frequently Asked <span className="text-brand-primary">Questions</span>
          </h2>
          <p className="font-sans text-lg text-textPalette-secondary leading-relaxed">
            Everything you need to know about switching your studio workflow to MomentGrid.
          </p>
        </div>

        {/* Accordion FAQ List */}
        <Card className="p-6 sm:p-10 bg-surface-0 shadow-md">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`}>
                <AccordionTrigger className="text-base sm:text-lg hover:text-brand-primary">
                  <span className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-brand-primary shrink-0 hidden sm:inline" />
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-textPalette-secondary sm:pl-8">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
      </div>
    </section>
  );
}

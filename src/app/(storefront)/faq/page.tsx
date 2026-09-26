import type { Metadata } from "next";
import { Faq, faq_data } from "@/modules/Faq";
import { faqItems } from "@/shared/config/faq";

export const metadata: Metadata = {
  title: faq_data.metaTitle,
  description: faq_data.lede,
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <Faq />
    </>
  );
}

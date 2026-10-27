import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Atelier Noir was founded on a simple premise: intimates built to be worn every day, not endured.",
};

export default function AboutPage() {
  return (
    <div className="container-page max-w-3xl py-24">
      <h1 className="font-display text-4xl">Our House</h1>
      <p className="mt-6 text-sm leading-relaxed text-charcoal/70">
        Atelier Noir was founded on a simple premise: intimates built to be worn every day, not
        endured. Every piece is developed in small runs with mills we return to again and again,
        favoring quiet construction over passing trend.
      </p>
      <p className="mt-4 text-sm leading-relaxed text-charcoal/70">
        We work primarily in silk, modal, and cotton-elastane blends, and we publish care notes
        for every piece so it can be kept in rotation for the long term.
      </p>
    </div>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Atelier Noir was founded on a simple premise: clothing built to be worn for years, not seasons.",
};

export default function AboutPage() {
  return (
    <div className="container-page max-w-3xl py-24">
      <h1 className="font-display text-4xl">Our House</h1>
      <p className="mt-6 text-sm leading-relaxed text-charcoal/70">
        Atelier Noir was founded on a simple premise: clothing built to be worn for years, not
        seasons. Every piece is developed in small runs with mills and ateliers we return to
        again and again, favoring quiet construction over passing trend.
      </p>
      <p className="mt-4 text-sm leading-relaxed text-charcoal/70">
        We work primarily in wool, cashmere, silk, and vegetable-tanned leather, and we publish
        care notes for every piece so it can be kept in rotation for the long term.
      </p>
    </div>
  );
}

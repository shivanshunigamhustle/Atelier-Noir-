"use client";

import { useState } from "react";
import Image from "next/image";
import { useStore } from "@/lib/store-context";
import { Button } from "@/components/ui/button";
import { editorialImage } from "@/lib/image-library";

export default function EditorialPage() {
  const { state, dispatch, toast } = useStore();
  const [hero, setHero] = useState(state.editorial.hero);
  const [lookbook, setLookbook] = useState(state.editorial.lookbook);

  function saveHero() {
    dispatch({ type: "UPDATE_EDITORIAL_HERO", hero });
    toast("Homepage hero updated");
  }

  function saveLookbook() {
    lookbook.forEach((slot) => dispatch({ type: "UPDATE_EDITORIAL_LOOKBOOK_SLOT", slot }));
    toast("Lookbook updated");
  }

  function replaceSlot(id: string) {
    setLookbook((slots) =>
      slots.map((s) =>
        s.id === id ? { ...s, image: editorialImage(Math.floor(Math.random() * 4), 900, 1150) } : s
      )
    );
  }

  return (
    <div>
      <h1 className="font-display mb-6 text-2xl">Editorial</h1>

      <section className="border border-line p-6">
        <h2 className="mb-5 text-sm font-medium">Hero banner</h2>
        <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
          <div className="relative aspect-[4/5] bg-sand">
            <Image src={hero.image} alt="" fill sizes="200px" className="object-cover" />
          </div>
          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-xs text-charcoal/60">
              Headline
              <input
                value={hero.headline}
                onChange={(e) => setHero({ ...hero, headline: e.target.value })}
                className="h-10 border border-line bg-ivory px-3 text-sm text-charcoal"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-xs text-charcoal/60">
              Subtext
              <input
                value={hero.subtext}
                onChange={(e) => setHero({ ...hero, subtext: e.target.value })}
                className="h-10 border border-line bg-ivory px-3 text-sm text-charcoal"
              />
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex flex-col gap-1.5 text-xs text-charcoal/60">
                CTA label
                <input
                  value={hero.ctaLabel}
                  onChange={(e) => setHero({ ...hero, ctaLabel: e.target.value })}
                  className="h-10 border border-line bg-ivory px-3 text-sm text-charcoal"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-xs text-charcoal/60">
                CTA link
                <select
                  value={hero.ctaCollectionSlug}
                  onChange={(e) => setHero({ ...hero, ctaCollectionSlug: e.target.value })}
                  className="h-10 border border-line bg-ivory px-3 text-sm text-charcoal"
                >
                  {state.collections.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <Button className="w-fit" onClick={saveHero}>
              Save Hero
            </Button>
          </div>
        </div>
      </section>

      <section className="mt-8 border border-line p-6">
        <h2 className="mb-5 text-sm font-medium">Lookbook row</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {lookbook.map((slot) => (
            <div key={slot.id}>
              <div className="relative aspect-[3/4] bg-sand">
                <Image src={slot.image} alt={slot.caption} fill sizes="200px" className="object-cover" />
              </div>
              <button onClick={() => replaceSlot(slot.id)} className="mt-2 text-xs underline underline-offset-4">
                Replace
              </button>
            </div>
          ))}
        </div>
        <Button className="mt-5" onClick={saveLookbook}>
          Save Lookbook
        </Button>
      </section>
    </div>
  );
}

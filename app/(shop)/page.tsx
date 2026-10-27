"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Leaf, Truck, ArrowCounterClockwise } from "@phosphor-icons/react";
import { useStore } from "@/lib/store-context";
import { ProductGrid } from "@/components/storefront/product-grid";
import { CATEGORY_TILES } from "@/lib/mock-data";

export default function HomePage() {
  const { state } = useStore();
  const { hero, lookbook } = state.editorial;
  const reduce = useReducedMotion();
  const newArrivals = [...state.products]
    .filter((p) => p.status === "Active")
    .sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1))
    .slice(0, 8);

  return (
    <div>
      <section className="relative flex h-[88vh] min-h-[560px] items-end overflow-hidden bg-charcoal">
        <Image
          src={hero.image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover photo-grade opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/75 via-charcoal/15 to-transparent" />
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="container-page relative z-10 pb-16 text-ivory"
        >
          <p className="text-xs tracking-[0.3em] text-ivory/70">THE AUTUMN / WINTER COLLECTION</p>
          <h1 className="font-display mt-4 max-w-xl whitespace-pre-line text-4xl leading-[1.08] sm:text-6xl lg:text-7xl">
            {hero.headline}
          </h1>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-ivory/85 sm:text-base">
            {hero.subtext}
          </p>
          <div className="relative mt-9 inline-block">
            <span className="absolute -bottom-2.5 -left-2.5 h-full w-full bg-gold" aria-hidden />
            <motion.div
              whileHover={reduce ? undefined : { x: -3, y: -3 }}
              whileTap={reduce ? undefined : { x: 0, y: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="relative"
            >
              <Link
                href={`/shop/${hero.ctaCollectionSlug}`}
                className="group relative inline-flex h-12 items-center gap-3 bg-charcoal px-7 text-xs font-medium tracking-[0.12em] text-ivory transition-colors hover:bg-charcoal-soft"
              >
                {hero.ctaLabel}
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section className="container-page py-20">
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
          {CATEGORY_TILES.map((tile, i) => (
            <motion.div
              key={tile.label}
              className="overflow-hidden rounded-[1.75rem] border border-line"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0, margin: "0px 0px -80px 0px" }}
              whileHover={reduce ? undefined : { y: -5 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 24,
                delay: reduce ? 0 : i * 0.05,
              }}
            >
              <Link href={tile.href} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden bg-sand shadow-[0_0_0_rgba(32,31,28,0)] transition-shadow duration-300 group-hover:shadow-[0_18px_32px_-14px_rgba(32,31,28,0.35)]">
                  <Image
                    src={tile.image}
                    alt={tile.label}
                    fill
                    sizes="(min-width: 640px) 25vw, 50vw"
                    className="object-cover photo-grade transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="flex items-center justify-between px-5 py-4">
                  <span className="text-xs tracking-[0.1em] text-charcoal">
                    {tile.label.toUpperCase()}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-charcoal/60 underline underline-offset-4">
                    Explore
                    <ArrowRight size={11} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container-page py-8">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="font-display text-3xl">The Pieces to Know</h2>
          <Link
            href="/shop"
            className="group flex items-center gap-1.5 text-sm text-charcoal/70 underline underline-offset-4"
          >
            View All
            <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
        <ProductGrid products={newArrivals} />
      </section>

      <section className="container-page mt-24 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <motion.div
          className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] lg:aspect-[5/6]"
          initial={reduce ? false : { opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src={lookbook[2]?.image ?? hero.image}
            alt="Silk Sleep Collection"
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover photo-grade"
          />
        </motion.div>
        <motion.div
          initial={reduce ? false : { opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-xs tracking-[0.3em] text-charcoal/50">THE ATELIER STORY</p>
          <h2 className="font-display mt-4 max-w-md text-4xl leading-[1.1] sm:text-5xl">
            Built from fabric that earns its keep.
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-charcoal/70">
            Every piece begins with a mill, not a mood board. We work in small runs with the same
            handful of ateliers season after season, so the silk, the modal and the stitching
            hold up long after the trend cycle moves on.
          </p>
          <Link
            href="/shop/silk-sleep-collection"
            className="group mt-7 inline-flex items-center gap-2 border-b border-charcoal pb-1 text-sm text-charcoal"
          >
            Explore the Silk Sleep Collection
            <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </section>

      <section className="container-page mt-24">
        <div className="grid grid-cols-1 divide-y divide-line-soft border-y border-line-soft sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[
            { icon: Leaf, title: "Considered Materials", body: "Silk, modal and cotton sourced from mills we visit ourselves." },
            { icon: Truck, title: "Complimentary Shipping", body: "On every order over $150, shipped within two business days." },
            { icon: ArrowCounterClockwise, title: "30-Day Returns", body: "Free returns on unworn pieces, no questions asked." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex flex-col items-center gap-3 px-6 py-10 text-center">
              <Icon size={22} className="text-olive" />
              <h3 className="text-sm font-medium tracking-[0.04em] text-charcoal">{title}</h3>
              <p className="max-w-[22ch] text-xs leading-relaxed text-charcoal/60">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative mt-24 flex min-h-[70vh] items-center overflow-hidden bg-charcoal text-ivory">
        <Image
          src={lookbook[0]?.image ?? hero.image}
          alt=""
          fill
          sizes="100vw"
          className="object-cover photo-grade opacity-50"
        />
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="container-page relative z-10 flex justify-center text-center"
        >
          <blockquote className="font-display max-w-2xl text-3xl leading-snug sm:text-4xl">
            &ldquo;Clothing that holds its shape, season after season.&rdquo;
          </blockquote>
        </motion.div>
      </section>
    </div>
  );
}

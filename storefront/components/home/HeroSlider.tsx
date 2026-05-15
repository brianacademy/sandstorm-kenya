"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

const slides = [
  { src: "/images/hero-1.png", alt: "Canvas backpack in olive green and cognac leather" },
  { src: "/images/hero-2.png", alt: "Woman carrying a Sandstorm Kenya tote in Nairobi" },
  { src: "/images/hero-3.png", alt: "Premium canvas duffle flat lay with leather accessories" },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  const go = useCallback((idx: number) => {
    setCurrent(((idx % slides.length) + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => go(current + 1), 5000);
    return () => clearInterval(timer);
  }, [current, go]);

  return (
    <section className="hero" aria-label="Featured collection">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`hero__slide${current === i ? " active" : ""}`}
          role="img"
          aria-label={slide.alt}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>
      ))}

      {/* Controls */}
      <div className="hero__controls">
        <Link href="/shop" className="btn btn-outline-white" style={{ backdropFilter: "blur(4px)" }}>
          SHOP THE LOOK
        </Link>
        <div className="hero__counter-row">
          <button className="hero__arrow" onClick={() => go(current - 1)} aria-label="Previous slide">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          </button>
          <span className="hero__counter">{current + 1} / {slides.length}</span>
          <button className="hero__arrow" onClick={() => go(current + 1)} aria-label="Next slide">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>
      </div>

      {/* Dots */}
      <div className="hero__dot-nav" role="tablist" aria-label="Slide indicators">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`hero__dot${current === i ? " active" : ""}`}
            role="tab"
            aria-label={`Go to slide ${i + 1}`}
            aria-selected={current === i}
            onClick={() => go(i)}
          />
        ))}
      </div>
    </section>
  );
}

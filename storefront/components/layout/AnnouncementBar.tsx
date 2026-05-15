"use client";

import { useState, useEffect } from "react";

const messages = [
  <>We ship worldwide.&nbsp;<a href="/contact" className="announcement-bar__link">Learn more</a></>,
  "Free delivery on orders over KSh 10,000",
  <>Guaranteed for life.&nbsp;<a href="/about" className="announcement-bar__link">Our promise</a></>,
];

export default function AnnouncementBar() {
  const [idx, setIdx] = useState(0);

  const prev = () => setIdx((i) => (i - 1 + messages.length) % messages.length);
  const next = () => setIdx((i) => (i + 1) % messages.length);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="announcement-bar" role="banner" aria-label="Site announcements">
      <div className="announcement-bar__content">{messages[idx]}</div>
      <nav className="announcement-bar__nav" aria-label="Announcement navigation">
        <button onClick={prev} aria-label="Previous announcement">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <button onClick={next} aria-label="Next announcement">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </nav>
    </div>
  );
}

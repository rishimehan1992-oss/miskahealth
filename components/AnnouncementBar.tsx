"use client";

import { announcementMessages } from "@/data/promos";

/** Minimalist-style scrolling promo strip */
export default function AnnouncementBar() {
  const track = [...announcementMessages, ...announcementMessages];

  return (
    <div
      className="announcement-bar fixed top-0 inset-x-0 z-[60] h-[var(--announcement-h)] bg-[#1C3A2A] text-white overflow-hidden"
      aria-live="polite"
    >
      <div className="announcement-track flex items-center h-full w-max">
        {track.map((msg, i) => (
          <span key={`${msg}-${i}`} className="announcement-item px-8 sm:px-12">
            {msg}
          </span>
        ))}
      </div>
    </div>
  );
}

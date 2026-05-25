"use client";

import { announcementMessages } from "@/data/promos";

/** Centered in-page marquee — does not sit over the header or hero copy */
export default function AnnouncementBar() {
  const track = [...announcementMessages, ...announcementMessages];

  return (
    <div className="flex justify-center mb-6 sm:mb-8 px-2" aria-live="polite">
      <div className="announcement-shell relative w-full max-w-md sm:max-w-xl h-9 sm:h-10 overflow-hidden rounded-full border border-[#1C3A2A]/15 bg-white/80 shadow-sm">
        <div className="announcement-track flex items-center h-full w-max">
          {track.map((msg, i) => (
            <span key={`${msg}-${i}`} className="announcement-item px-6 sm:px-10 text-[#1C3A2A]">
              {msg}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

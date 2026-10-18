"use client";

import Image from "next/image";
import { track } from "@vercel/analytics";
import { ArrowRight } from "lucide-react";
import type { Dictionary, Locale } from "@/lib/i18n";

const PLATFORMS = ["iOS", "Android", "macOS", "Windows", "Linux"];

export function PromoBanner({ lang, t }: { lang: Locale; t: Dictionary }) {
  const href = `https://1bookmark.net/?lang=${lang}&utm_source=youtube-playlist-maker&utm_medium=banner`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      onClick={() => track("banner_click", { lang })}
      className="group from-primary/15 via-primary/5 border-primary/30 hover:border-primary/60 relative flex flex-col gap-4 overflow-hidden rounded-2xl border bg-gradient-to-br to-transparent p-4 transition-colors sm:p-6 sm:flex-row sm:items-center sm:gap-6"
    >
      <Image src="/1bookmark-logo.svg" alt="1Bookmark" width={64} height={64} className="size-14 shrink-0 rounded-xl shadow-sm sm:size-16" />
      <div className="flex flex-1 flex-col gap-1">
        <span className="text-primary text-xs font-semibold">{t.banner.eyebrow}</span>
        <h2 className="text-base font-semibold break-keep sm:text-lg">{t.banner.title}</h2>
        <p className="text-muted-foreground text-sm break-keep">{t.banner.body}</p>
        <ul className="mt-1.5 flex flex-wrap gap-1">
          {PLATFORMS.map((platform) => (
            <li key={platform} className="border-primary/30 text-muted-foreground rounded-md border px-1.5 py-0.5 text-[11px] leading-none font-medium">
              {platform}
            </li>
          ))}
        </ul>
      </div>
      <span className="bg-primary text-primary-foreground inline-flex h-9 shrink-0 items-center whitespace-nowrap justify-center gap-1.5 self-start rounded-lg px-3 text-sm font-medium sm:self-center">
        {t.banner.cta}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </a>
  );
}

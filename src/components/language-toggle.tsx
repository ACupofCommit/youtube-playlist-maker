"use client";

import { Segmented } from "@/components/segmented";
import type { Locale } from "@/lib/i18n";

export function LanguageToggle({ lang, label }: { lang: Locale; label: string }) {
  return (
    <Segmented<Locale>
      label={label}
      value={lang}
      // [lang] 이 루트 레이아웃이라 클라이언트 전환하면 next-themes 스크립트가 다시 렌더되어 경고가 난다. 페이지를 새로 연다.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      onChange={(locale) => window.location.assign(`/${locale}`)}
      options={[
        { value: "ko", label: "한국어", content: "KO" },
        { value: "en", label: "English", content: "EN" },
      ]}
    />
  );
}

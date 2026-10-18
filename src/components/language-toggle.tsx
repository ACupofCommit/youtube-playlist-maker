"use client";

import { Languages } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Locale } from "@/lib/i18n";

const NAMES: Record<Locale, string> = { ko: "한국어", en: "English" };

export function LanguageToggle({ lang, label }: { lang: Locale; label: string }) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="sm" aria-label={label} />}>
        <Languages className="size-4" />
        <span className="text-xs uppercase">{lang}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        <DropdownMenuRadioGroup value={lang} onValueChange={(value) => router.push(`/${value}`)}>
          {(Object.keys(NAMES) as Locale[]).map((locale) => (
            <DropdownMenuRadioItem key={locale} value={locale}>
              {NAMES[locale]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import Link from "next/link";
import { ListVideo } from "lucide-react";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import type { Dictionary, Locale } from "@/lib/i18n";

export function Header({ lang, t }: { lang: Locale; t: Dictionary }) {
  return (
    <header className="bg-background/80 sticky top-0 z-10 border-b backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between px-4">
        <Link href={`/${lang}`} className="flex items-center gap-2 font-semibold">
          <ListVideo className="text-primary size-5" />
          <span className="hidden sm:inline">YouTube Playlist Maker</span>
        </Link>
        <div className="flex items-center gap-2">
          <LanguageToggle lang={lang} label={t.header.language} />
          <ThemeToggle labels={t.header} />
        </div>
      </div>
    </header>
  );
}

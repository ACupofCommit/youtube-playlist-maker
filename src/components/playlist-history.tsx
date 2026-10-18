"use client";

import Image from "next/image";
import { ArrowUpToLine, Copy, ExternalLink, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { removeHistory, useHistory, type HistoryEntry } from "@/lib/history";
import { format, type Dictionary, type Locale } from "@/lib/i18n";
import { thumbnailUrl } from "@/lib/youtube";

/** 복사하거나 연 재생목록 목록. 이 브라우저에만 남는다. onLoad 는 항목을 위 입력 폼에 다시 채운다. */
export function PlaylistHistory({
  lang,
  t,
  onLoad,
}: {
  lang: Locale;
  t: Dictionary;
  onLoad: (entry: HistoryEntry) => void;
}) {
  const history = useHistory();
  if (history.length === 0) return null;

  async function copy(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      toast.success(t.result.copied);
    } catch {
      toast.error(t.result.copyFailed);
    }
  }

  const date = new Intl.DateTimeFormat(lang, { dateStyle: "medium", timeStyle: "short" });

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-0.5">
        <h2 className="font-semibold">{t.history.title}</h2>
        <p className="text-muted-foreground text-xs">{t.history.note}</p>
      </div>
      <Card className="gap-0 py-0">
        <ul className="divide-y">
          {history.map((entry) => (
            <li key={entry.url} className="flex items-center gap-2.5 px-2.5 py-1.5">
              {entry.videoIds[0] && (
                <Image
                  src={thumbnailUrl(entry.videoIds[0])}
                  alt=""
                  width={64}
                  height={36}
                  unoptimized
                  className="aspect-video w-14 shrink-0 rounded object-cover"
                />
              )}
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm leading-tight font-medium">{entry.title || t.history.untitled}</span>
                <span className="text-muted-foreground text-[11px] leading-tight">
                  {format(t.history.count, { count: entry.videoIds.length })} · {date.format(entry.savedAt)}
                </span>
              </div>
              <div className="flex shrink-0 items-center">
                <Button variant="ghost" size="icon-xs" aria-label={t.history.load} title={t.history.load} onClick={() => onLoad(entry)}>
                  <ArrowUpToLine />
                </Button>
                <Button variant="ghost" size="icon-xs" aria-label={t.history.copy} title={t.history.copy} onClick={() => copy(entry.url)}>
                  <Copy />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label={t.history.open}
                  title={t.history.open}
                  render={<a href={entry.url} target="_blank" rel="noopener noreferrer" />}
                  nativeButton={false}
                >
                  <ExternalLink />
                </Button>
                <Button variant="ghost" size="icon-xs" aria-label={t.history.remove} title={t.history.remove} onClick={() => removeHistory(entry.url)}>
                  <X />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}

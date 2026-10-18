"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp, Check, Copy, ExternalLink, Sparkles, X } from "lucide-react";
import { track } from "@vercel/analytics";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format, type Dictionary } from "@/lib/i18n";
import { YOUTUBE_PLAYLIST_MAX, parseInput, thumbnailUrl, youtubePlaylistUrl } from "@/lib/youtube";

const SAMPLE = [
  "https://www.youtube.com/watch?v=gdZLi9oWNZg",
  "https://youtu.be/JGwWNGJdvx8",
  "https://www.youtube.com/watch?v=9bZkp7q19f0",
  "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
  // aespa: Supernova, Whiplash
  "https://www.youtube.com/watch?v=phuiiNCxRMg",
  "https://youtu.be/jWQx2f-CErU",
  // NMIXX: DASH
  "https://www.youtube.com/watch?v=7UecFm_bSTU",
].join("\n");

/** 목록에서 순서를 바꾸거나 뺄 때는 입력창을 정리된 링크로 다시 쓴다. */
function toText(videoIds: string[]): string {
  return videoIds.map((id) => `https://www.youtube.com/watch?v=${id}`).join("\n");
}

export function PlaylistMaker({ t }: { t: Dictionary }) {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const titles = useVideoTitles(text);

  const { videoIds, invalid } = useMemo(() => parseInput(text), [text]);
  const duplicateCount = videoIds.length - new Set(videoIds).size;
  const overflow = Math.max(0, videoIds.length - YOUTUBE_PLAYLIST_MAX);
  const playlistUrl = videoIds.length > 0 ? youtubePlaylistUrl(videoIds, title) : null;
  const playlistCount = Math.min(videoIds.length, YOUTUBE_PLAYLIST_MAX);

  const copied = playlistUrl !== null && copiedUrl === playlistUrl;

  function fillSample() {
    setText(SAMPLE);
    setTitle(t.input.sampleTitle);
  }

  function clear() {
    setText("");
    // 예시로 넣은 이름은 같이 지운다. 직접 쓴 이름은 남긴다.
    if (title === t.input.sampleTitle) setTitle("");
  }

  function update(next: string[]) {
    setText(toText(next));
  }

  function move(index: number, delta: number) {
    const next = [...videoIds];
    const [item] = next.splice(index, 1);
    next.splice(index + delta, 0, item);
    update(next);
  }

  async function copy() {
    if (!playlistUrl) return;
    track("playlist_copy", { count: playlistCount });
    try {
      await navigator.clipboard.writeText(playlistUrl);
      setCopiedUrl(playlistUrl);
      toast.success(t.result.copied);
    } catch {
      toast.error(t.result.copyFailed);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* 처음 온 사람이 예시 넣기를 눌러 보도록 인물이 버튼을 가리킨다(손끝은 이미지 위에서 약 8%).
          배너와 같이 lg 미만에서는 카드 오른쪽에 붙어 카드가 그만큼 줄고, lg 이상에서는 카드 바깥 여백에 둔다.
          버튼 가운데는 카드 위에서 약 2.75rem(안내 문구 두 줄)·2.25rem(한 줄)이다. */}
      <div className="flex items-start gap-1 lg:relative lg:block">
        <Card className="min-w-0 flex-1">
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <label htmlFor="links" className="text-sm font-medium">
                    {t.input.label}
                  </label>
                  <p className="text-muted-foreground text-xs">{format(t.input.hint, { max: YOUTUBE_PLAYLIST_MAX })}</p>
                </div>
                {text ? (
                  <Button variant="ghost" size="xs" className="shrink-0" onClick={clear}>
                    <X /> {t.input.clear}
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" className="sample-nudge shrink-0" onClick={fillSample}>
                    <Sparkles /> {t.input.sample}
                  </Button>
                )}
              </div>
              <Textarea
                id="links"
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder={t.input.placeholder}
                spellCheck={false}
                autoFocus
                className="min-h-36 font-mono text-xs sm:text-sm"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="title" className="text-sm font-medium">
                {t.input.titleLabel}
              </label>
              <Input
                id="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder={t.input.titlePlaceholder}
                maxLength={100}
              />
            </div>
          </CardContent>
        </Card>
        {!text && (
          <Image
            src="/banner/point-left.png"
            alt=""
            width={264}
            height={480}
            className="pointer-events-none mt-11 h-32 w-auto max-w-none shrink-0 -translate-y-[8%] select-none sm:mt-9 sm:h-44 lg:absolute lg:top-9 lg:left-full lg:mt-0 lg:ml-3 lg:h-60"
          />
        )}
      </div>

      {playlistUrl && (
        <Card className="ring-primary/40 ring-2">
          <CardHeader>
            <CardTitle>{t.result.title}</CardTitle>
            <CardDescription>{t.result.note}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Input readOnly value={playlistUrl} onFocus={(event) => event.target.select()} className="font-mono text-xs" />
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                size="lg"
                className="sm:flex-1"
                render={<a href={playlistUrl} target="_blank" rel="noopener noreferrer" />}
                onClick={() => track("playlist_open", { count: playlistCount })}
                nativeButton={false}
              >
                <ExternalLink /> {t.result.open}
              </Button>
              <Button size="lg" variant="outline" className="sm:flex-1" onClick={copy}>
                {copied ? <Check /> : <Copy />} {t.result.copy}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {(videoIds.length > 0 || invalid.length > 0) && (
        <section className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-semibold">{format(t.list.title, { count: videoIds.length })}</h2>
            {duplicateCount > 0 && (
              <Button variant="outline" size="xs" onClick={() => update([...new Set(videoIds)])}>
                {format(t.list.dedupe, { count: duplicateCount })}
              </Button>
            )}
          </div>
          {overflow > 0 && (
            <p className="text-destructive text-sm">{format(t.list.overflow, { count: overflow, max: YOUTUBE_PLAYLIST_MAX })}</p>
          )}
          {invalid.length > 0 && (
            <details className="text-muted-foreground text-sm">
              <summary className="cursor-pointer">{format(t.list.invalid, { count: invalid.length })}</summary>
              <ul className="mt-2 flex flex-col gap-1 font-mono text-xs break-all">
                {invalid.map((token, index) => (
                  <li key={index}>{token}</li>
                ))}
              </ul>
            </details>
          )}
          {videoIds.length === 0 ? (
            <p className="text-muted-foreground text-sm">{t.list.empty}</p>
          ) : (
            <ol className="flex flex-col gap-2">
              {videoIds.map((id, index) => (
                <li
                  key={`${id}-${index}`}
                  className={`bg-card flex items-center gap-3 rounded-xl border p-2 ${index >= YOUTUBE_PLAYLIST_MAX ? "opacity-40" : ""}`}
                >
                  <Badge variant="secondary" className="w-7 shrink-0 justify-center tabular-nums">
                    {index + 1}
                  </Badge>
                  <Image
                    src={thumbnailUrl(id)}
                    alt=""
                    width={96}
                    height={54}
                    unoptimized
                    className="aspect-video w-20 shrink-0 rounded-md object-cover sm:w-24"
                  />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-medium">{titles[id] ?? id}</span>
                    <span className="text-muted-foreground font-mono text-xs">{id}</span>
                  </div>
                  <div className="flex shrink-0 items-center">
                    <Button variant="ghost" size="icon-sm" aria-label={t.list.moveUp} disabled={index === 0} onClick={() => move(index, -1)}>
                      <ArrowUp />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={t.list.moveDown}
                      disabled={index === videoIds.length - 1}
                      onClick={() => move(index, 1)}
                    >
                      <ArrowDown />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={t.list.remove}
                      onClick={() => update(videoIds.filter((_, i) => i !== index))}
                    >
                      <X />
                    </Button>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </section>
      )}
    </div>
  );
}

/** YouTube oEmbed 로 영상 제목을 가져온다. 실패하면 영상 ID 를 그대로 보여 준다. */
function useVideoTitles(text: string): Record<string, string> {
  const [titles, setTitles] = useState<Record<string, string>>({});
  const requested = useRef(new Set<string>());
  const ids = useMemo(() => [...new Set(parseInput(text).videoIds)], [text]);

  useEffect(() => {
    // 입력 중에 매번 부르지 않도록 잠깐 기다린다.
    const timer = setTimeout(() => {
      for (const id of ids.slice(0, YOUTUBE_PLAYLIST_MAX)) {
        if (requested.current.has(id)) continue;
        requested.current.add(id);
        const url = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}`;
        fetch(url)
          .then((response) => (response.ok ? response.json() : null))
          .then((data: { title?: string } | null) => {
            const title = data?.title;
            if (title) setTitles((prev) => ({ ...prev, [id]: title }));
          })
          .catch(() => {});
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [ids]);

  return titles;
}

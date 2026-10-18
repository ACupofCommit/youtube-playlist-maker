"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp, Check, Copy, ExternalLink, Sparkles, X } from "lucide-react";
import { track } from "@vercel/analytics";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format, type Dictionary } from "@/lib/i18n";
import { YOUTUBE_PLAYLIST_MAX, parseInput, thumbnailUrl, youtubePlaylistUrl } from "@/lib/youtube";

// 예시 1: 하늘을 나는 테슬라 로드스터 공개(2026-10) 관련 쇼츠. 공개 장면 → 원리 설명 → 밈 순서.
// 예시 2: 출근길 노래 뮤직비디오.
const SAMPLES = [
  [
    "https://www.youtube.com/shorts/75QHJ2AyNlk",
    "https://www.youtube.com/shorts/wr_kIL-4BYQ",
    "https://www.youtube.com/shorts/q3w7r-lzGqk",
    "https://www.youtube.com/shorts/fdm5URRPCAQ",
    "https://www.youtube.com/shorts/JtFG4DCkpWQ",
    "https://www.youtube.com/shorts/TG0EdQBe6YI",
    "https://www.youtube.com/shorts/-MRwZayLzJQ",
    "https://www.youtube.com/shorts/_d6ZCS4qbdc",
    "https://www.youtube.com/shorts/6TYyLvZuXsI",
  ],
  [
    "https://youtu.be/JGwWNGJdvx8", // Ed Sheeran - Shape of You
    "https://youtu.be/jWQx2f-CErU", // aespa - Whiplash
    "https://www.youtube.com/watch?v=9bZkp7q19f0", // PSY - 강남스타일
    "https://www.youtube.com/watch?v=kJQP7kiw5Fk", // Luis Fonsi - Despacito
    "https://www.youtube.com/watch?v=phuiiNCxRMg", // aespa - Supernova
    "https://www.youtube.com/watch?v=7UecFm_bSTU", // NMIXX - DASH
    "https://www.youtube.com/watch?v=gdZLi9oWNZg", // BTS - Dynamite
  ],
].map((links) => links.join("\n"));

/** 목록에서 순서를 바꾸거나 뺄 때는 입력창을 정리된 링크로 다시 쓴다. */
function toText(videoIds: string[]): string {
  return videoIds.map((id) => `https://www.youtube.com/watch?v=${id}`).join("\n");
}

export function PlaylistMaker({ t }: { t: Dictionary }) {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const titles = useVideoTitles(text);
  const cardRef = useRef<HTMLDivElement>(null);
  const samplesRef = useRef<HTMLDivElement>(null);
  const sampleCenter = useSampleCenter(cardRef, samplesRef, !text);

  const { videoIds, invalid } = useMemo(() => parseInput(text), [text]);
  const duplicateCount = videoIds.length - new Set(videoIds).size;
  const overflow = Math.max(0, videoIds.length - YOUTUBE_PLAYLIST_MAX);
  const playlistUrl = videoIds.length > 0 ? youtubePlaylistUrl(videoIds, title) : null;
  const playlistCount = Math.min(videoIds.length, YOUTUBE_PLAYLIST_MAX);

  const copied = playlistUrl !== null && copiedUrl === playlistUrl;

  function fillSample(index: number) {
    setText(SAMPLES[index]);
    setTitle(t.input.samples[index].title);
  }

  function clear() {
    setText("");
    // 예시로 넣은 이름은 같이 지운다. 직접 쓴 이름은 남긴다.
    if (t.input.samples.some((sample) => sample.title === title)) setTitle("");
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
          버튼 높이는 안내 문구 줄 수에 따라 달라서 실제 위치를 재서 맞춘다(useSampleCenter). */}
      <div className="flex items-start gap-1 lg:relative lg:block">
        <Card ref={cardRef} className="min-w-0 flex-1">
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              {/* 좁은 화면에서는 예시 버튼이 안내 문구 아래 줄로 내려간다. */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex min-w-60 flex-1 flex-col gap-1">
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
                  <div ref={samplesRef} className="ml-auto flex shrink-0 gap-1.5">
                    {t.input.samples.map((sample, index) => (
                      <Button key={index} variant="ghost" size="sm" className="sample-nudge" title={sample.title} onClick={() => fillSample(index)}>
                        {index === 0 && <Sparkles />} {sample.label}
                      </Button>
                    ))}
                  </div>
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
            // lg 미만은 카드 옆(흐름 안)이라 margin-top, lg 이상은 카드 밖(absolute)이라 top 으로 버튼 가운데에 맞춘다.
            style={{ "--sample-center": `${sampleCenter}px` } as React.CSSProperties}
            className="pointer-events-none mt-(--sample-center) h-32 w-auto max-w-none shrink-0 -translate-y-[8%] select-none sm:h-44 lg:absolute lg:top-(--sample-center) lg:left-full lg:mt-0 lg:ml-3 lg:h-60"
          />
        )}
      </div>

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
            <Card className="gap-0 py-0">
              <ol className="divide-y">
                {videoIds.map((id, index) => (
                  <li
                    key={`${id}-${index}`}
                    className={`flex items-center gap-2.5 px-2.5 py-1.5 ${index >= YOUTUBE_PLAYLIST_MAX ? "opacity-40" : ""}`}
                  >
                    <span className="text-muted-foreground w-5 shrink-0 text-right text-xs tabular-nums">{index + 1}</span>
                    <Image
                      src={thumbnailUrl(id)}
                      alt=""
                      width={64}
                      height={36}
                      unoptimized
                      className="aspect-video w-14 shrink-0 rounded object-cover"
                    />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-sm leading-tight font-medium">{titles[id] ?? id}</span>
                      <span className="text-muted-foreground font-mono text-[11px] leading-tight">{id}</span>
                    </div>
                    <div className="flex shrink-0 items-center">
                      <Button variant="ghost" size="icon-xs" aria-label={t.list.moveUp} disabled={index === 0} onClick={() => move(index, -1)}>
                        <ArrowUp />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        aria-label={t.list.moveDown}
                        disabled={index === videoIds.length - 1}
                        onClick={() => move(index, 1)}
                      >
                        <ArrowDown />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        aria-label={t.list.remove}
                        onClick={() => update(videoIds.filter((_, i) => i !== index))}
                      >
                        <X />
                      </Button>
                    </div>
                  </li>
                ))}
              </ol>
            </Card>
          )}
        </section>
      )}

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
    </div>
  );
}

/** 카드 위쪽에서 예시 버튼 세로 가운데까지의 거리(px). 화면 폭에 따라 버튼 줄이 바뀌므로 크기가 바뀔 때마다 다시 잰다. */
function useSampleCenter(
  cardRef: React.RefObject<HTMLDivElement | null>,
  samplesRef: React.RefObject<HTMLDivElement | null>,
  enabled: boolean,
): number {
  const [center, setCenter] = useState(36);

  useEffect(() => {
    const card = cardRef.current;
    const samples = samplesRef.current;
    if (!enabled || !card || !samples) return;
    const measure = () => {
      const cardTop = card.getBoundingClientRect().top;
      const box = samples.getBoundingClientRect();
      setCenter(Math.round(box.top + box.height / 2 - cardTop));
    };
    const observer = new ResizeObserver(measure);
    observer.observe(card);
    return () => observer.disconnect();
  }, [cardRef, samplesRef, enabled]);

  return center;
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

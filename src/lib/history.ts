// 사용자가 복사하거나 연 재생목록을 이 브라우저(localStorage)에만 남긴다.
// 저장소를 못 쓰는 환경(사생활 보호 모드 등)에서는 조용히 아무것도 남기지 않는다.

import { useSyncExternalStore } from "react";

export type HistoryEntry = {
  url: string;
  title: string;
  videoIds: string[];
  /** 마지막으로 복사하거나 연 시각(ms). */
  savedAt: number;
};

const KEY = "youtube-playlist-maker:history";
/** 너무 쌓이지 않게 최근 것만 남긴다. */
const MAX = 50;
const EMPTY: HistoryEntry[] = [];

const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cached: HistoryEntry[] = EMPTY;

function read(): HistoryEntry[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    return EMPTY;
  }
  // useSyncExternalStore 는 같은 값이면 같은 참조를 받아야 하므로 원문이 같으면 이전 배열을 준다.
  if (raw === cachedRaw) return cached;
  cachedRaw = raw;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    cached = Array.isArray(parsed) ? (parsed as HistoryEntry[]) : EMPTY;
  } catch {
    cached = EMPTY;
  }
  return cached;
}

function write(entries: HistoryEntry[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(entries));
  } catch {
    // 저장하지 못해도 재생목록 만들기는 그대로 된다.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // 다른 탭에서 바꾼 것도 반영한다.
  const onStorage = (event: StorageEvent) => event.key === KEY && listener();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** 같은 주소는 하나만 두고 맨 위로 올린다. */
export function saveHistory(entry: Omit<HistoryEntry, "savedAt">) {
  const rest = read().filter((item) => item.url !== entry.url);
  write([{ ...entry, savedAt: Date.now() }, ...rest].slice(0, MAX));
}

export function removeHistory(url: string) {
  write(read().filter((item) => item.url !== url));
}

export function useHistory(): HistoryEntry[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

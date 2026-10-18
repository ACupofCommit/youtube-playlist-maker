export const LOCALES = ["ko", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

const ko = {
  meta: {
    title: "YouTube 재생목록 만들기 — 링크 여러 개를 하나로",
    description:
      "YouTube 영상 링크 여러 개를 붙여 넣으면 로그인 없이 바로 재생되는 재생목록 링크 하나로 만들어 드립니다.",
  },
  header: { theme: "화면 모드", light: "라이트", dark: "다크", system: "시스템", language: "언어" },
  hero: {
    title: "YouTube 링크 여러 개를\n재생목록 하나로",
    subtitle: "링크를 붙여 넣으면 로그인 없이 이어서 재생되는 재생목록 링크를 만들어 드려요.",
  },
  input: {
    label: "YouTube 링크",
    placeholder:
      "https://www.youtube.com/watch?v=...\nhttps://youtu.be/...\nhttps://www.youtube.com/shorts/...",
    hint: "한 줄에 하나씩, 또는 공백·쉼표로 나눠 붙여 넣으세요. 최대 {max}개까지 들어갑니다.",
    clear: "지우기",
    sample: "예시 넣기",
    titleLabel: "재생목록 이름 (선택)",
    titlePlaceholder: "예: 주말에 볼 영상",
  },
  list: {
    title: "영상 {count}개",
    empty: "아직 읽은 영상이 없어요.",
    dedupe: "중복 {count}개 빼기",
    overflow: "{max}개를 넘는 영상 {count}개는 재생목록에 들어가지 않아요.",
    invalid: "영상 링크가 아니라 건너뛴 항목 {count}개",
    moveUp: "위로",
    moveDown: "아래로",
    remove: "빼기",
  },
  result: {
    title: "재생목록 링크",
    open: "YouTube에서 열기",
    copy: "링크 복사",
    copied: "링크를 복사했어요.",
    copyFailed: "복사하지 못했어요. 직접 선택해 복사해 주세요.",
    note: "YouTube가 만드는 임시 재생목록이에요. 열면 YouTube가 재생목록 주소를 새로 붙여 줍니다.",
  },
  banner: {
    label: "특별한 광고",
    eyebrow: "1Bookmark",
    title: "유튜브 북마크를 여러 개 선택해서 바로 재생목록으로",
    body: "1Bookmark에 모아 둔 YouTube 북마크를 골라 재생을 누르면 이 재생목록이 바로 열려요. 팀·개인 북마크를 데스크톱·모바일·Raycast 어디서나 검색하세요.",
    cta: "1Bookmark 알아보기",
  },
  footer: { madeBy: "커밋한잔이 만들었어요" },
};

export type Dictionary = typeof ko;

const en: Dictionary = {
  meta: {
    title: "YouTube Playlist Maker — Turn many links into one",
    description:
      "Paste several YouTube video links and get a single playlist link that plays them in order. No sign-in needed.",
  },
  header: { theme: "Theme", light: "Light", dark: "Dark", system: "System", language: "Language" },
  hero: {
    title: "Many YouTube links,\none playlist",
    subtitle: "Paste your links and get a playlist link that plays them back to back. No sign-in needed.",
  },
  input: {
    label: "YouTube links",
    placeholder:
      "https://www.youtube.com/watch?v=...\nhttps://youtu.be/...\nhttps://www.youtube.com/shorts/...",
    hint: "One per line, or separated by spaces or commas. Up to {max} videos.",
    clear: "Clear",
    sample: "Try a sample",
    titleLabel: "Playlist name (optional)",
    titlePlaceholder: "e.g. Weekend watch list",
  },
  list: {
    title: "{count} videos",
    empty: "No videos yet.",
    dedupe: "Remove duplicates ({count})",
    overflow: "{count} videos beyond the first {max} won't be included.",
    invalid: "Skipped non-video items ({count})",
    moveUp: "Move up",
    moveDown: "Move down",
    remove: "Remove",
  },
  result: {
    title: "Playlist link",
    open: "Open in YouTube",
    copy: "Copy link",
    copied: "Link copied.",
    copyFailed: "Couldn't copy. Please select and copy it manually.",
    note: "This is a temporary playlist made by YouTube. Opening it gives you a fresh playlist URL.",
  },
  banner: {
    label: "Special ad",
    eyebrow: "1Bookmark",
    title: "Pick several YouTube bookmarks and play them as a playlist",
    body: "Select YouTube bookmarks in 1Bookmark and hit Play to open them as a playlist. Search team and personal bookmarks from desktop, mobile, and Raycast.",
    cta: "Discover 1Bookmark",
  },
  footer: { madeBy: "Made by A Cup of Commit" },
};

const dictionaries: Record<Locale, Dictionary> = { ko, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/** "{count}개" 같은 자리에 값을 넣는다. */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ""));
}

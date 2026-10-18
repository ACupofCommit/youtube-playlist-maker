// 1Bookmark 일괄 재생(@repo/ui/youtube)과 같은 규칙으로 YouTube 주소를 읽고 재생목록 주소를 만든다.
//
// 재생목록은 YouTube 의 watch_videos 주소로 만든다. 로그인 없이 영상 ID 목록만으로 임시
// 재생목록(list=TLGG…)을 만들어 준다. 공식 문서에는 없는 주소라 막히면 이 파일만 고친다.

// YouTube 영상 ID 는 11자다.
const VIDEO_ID = "([0-9A-Za-z_-]{11})(?![0-9A-Za-z_-])";
const HOST = "^https?:\\/\\/(?:(?:www|m|music)\\.)?";

const PATTERNS = [
  // youtube.com/watch?v=ID — v 가 다른 파라미터 뒤에 와도 받는다.
  new RegExp(`${HOST}youtube\\.com\\/watch\\/?\\?(?:[^#]*&)?v=${VIDEO_ID}`, "i"),
  // youtube.com/shorts/ID, /live/ID, /embed/ID, /v/ID
  new RegExp(`${HOST}youtube\\.com\\/(?:shorts|live|embed|v)\\/${VIDEO_ID}`, "i"),
  // youtu.be/ID
  new RegExp(`^https?:\\/\\/youtu\\.be\\/${VIDEO_ID}`, "i"),
];

/** 영상 하나를 가리키는 YouTube 주소면 영상 ID 를, 아니면(채널·재생목록·다른 사이트) null. */
export function youtubeVideoId(url: string): string | null {
  let text = url.trim();
  // 주소창에서 복사하면 스킴이 빠지기도 한다.
  if (!/^https?:\/\//i.test(text)) text = `https://${text}`;
  for (const pattern of PATTERNS) {
    const match = pattern.exec(text);
    if (match?.[1]) return match[1];
  }
  return null;
}

/** watch_videos 가 한 번에 받는 영상 수. 넘치는 뒤쪽은 넣지 않는다. */
export const YOUTUBE_PLAYLIST_MAX = 50;

/** 영상 ID 를 준 순서대로 이어서 트는 임시 재생목록 주소. 앞의 {@link YOUTUBE_PLAYLIST_MAX}개만 넣는다. */
export function youtubePlaylistUrl(videoIds: string[], title?: string): string {
  const url = `https://www.youtube.com/watch_videos?video_ids=${videoIds.slice(0, YOUTUBE_PLAYLIST_MAX).join(",")}`;
  const trimmed = title?.trim();
  return trimmed ? `${url}&title=${encodeURIComponent(trimmed)}` : url;
}

export type ParsedInput = {
  /** 읽은 순서대로의 영상 ID. 중복은 그대로 둔다. */
  videoIds: string[];
  /** 영상 주소로 읽지 못한 조각. */
  invalid: string[];
};

/** 붙여 넣은 글에서 영상 주소를 읽는다. 줄바꿈·공백·쉼표로 나눈다. */
export function parseInput(text: string): ParsedInput {
  const videoIds: string[] = [];
  const invalid: string[] = [];
  for (const token of text.split(/[\s,]+/)) {
    if (!token) continue;
    const id = youtubeVideoId(token);
    if (id) videoIds.push(id);
    else invalid.push(token);
  }
  return { videoIds, invalid };
}

export function thumbnailUrl(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;
}

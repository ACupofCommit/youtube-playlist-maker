# YouTube Playlist Maker

YouTube 영상 링크 여러 개를 로그인 없이 이어서 재생되는 재생목록 링크(`watch_videos`) 하나로 만드는 1페이지 서비스. 1Bookmark 일괄 재생(#811)과 같은 규칙(`src/lib/youtube.ts`)을 쓴다.

- Next.js 16 (App Router) + Tailwind CSS v4 + shadcn/ui (base-ui)
- 화면 모드: 라이트·다크·시스템 (`next-themes`)
- 언어: `/ko`, `/en`. `/` 는 브라우저 언어로 보낸다 (`src/proxy.ts`)
- 영상 제목은 YouTube oEmbed 로 브라우저에서 가져온다

```bash
pnpm install
pnpm dev   # http://localhost:3000
```

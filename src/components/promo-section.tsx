import Image from "next/image";
import { PromoBanner } from "@/components/promo-banner";
import type { Dictionary, Locale } from "@/lib/i18n";

// 인물의 손끝이 배너 세로 가운데를 가리키도록 옮긴다. 손끝 높이는 이미지 높이 대비 비율이라 크기가 바뀌어도 맞는다.
// point-right: 손끝이 위에서 23%, point-left: 두 손끝의 가운데가 위에서 약 10%.
// - lg 미만: 배너 양옆에 작게 붙여 둔다(릴스 같은 세로 화면에서도 보이게). 가운데 정렬 후 (50% - 손끝)만큼 내린다.
// - lg 이상: 배너 바깥 여백에 둔다. 위를 배너 가운데에 맞춘 뒤 손끝만큼 올린다.
export function PromoSection({ lang, t }: { lang: Locale; t: Dictionary }) {
  return (
    <section className="pb-12 lg:pb-36">
      <div className="flex items-center gap-1 lg:relative lg:block">
        <Image
          src="/banner/point-right.png"
          alt=""
          width={197}
          height={480}
          className="pointer-events-none h-32 w-auto shrink-0 translate-y-[27%] select-none sm:h-44 lg:absolute lg:top-1/2 lg:right-full lg:mr-3 lg:h-60 lg:-translate-y-[23%]"
        />
        {/* 좁은 화면에서는 양옆에 인물이 붙으므로 표시를 배너 열 안에 둬 배너 바로 위에 오게 한다. */}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <span className="text-muted-foreground text-xs font-medium">{t.banner.label}</span>
          <PromoBanner lang={lang} t={t} />
        </div>
        <Image
          src="/banner/point-left.png"
          alt=""
          width={264}
          height={480}
          className="pointer-events-none h-32 w-auto shrink-0 translate-y-[40%] select-none sm:h-44 lg:absolute lg:top-1/2 lg:left-full lg:ml-3 lg:h-60 lg:-translate-y-[10%]"
        />
      </div>
    </section>
  );
}

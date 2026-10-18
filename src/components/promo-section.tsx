import Image from "next/image";
import { PromoBanner } from "@/components/promo-banner";
import type { Dictionary, Locale } from "@/lib/i18n";

/** 홍보 배너에 "특별한 광고" 표시와 양옆에서 배너를 가리키는 인물을 붙인다. 인물은 여백이 있는 넓은 화면에서만 보인다. */
export function PromoSection({ lang, t }: { lang: Locale; t: Dictionary }) {
  return (
    <section className="flex flex-col gap-2">
      <span className="text-muted-foreground text-xs font-medium">{t.banner.label}</span>
      <div className="relative">
        <Image
          src="/banner/point-right.png"
          alt=""
          width={197}
          height={480}
          className="pointer-events-none absolute right-full bottom-0 mr-3 hidden h-44 w-auto select-none lg:block"
        />
        <PromoBanner lang={lang} t={t} />
        <Image
          src="/banner/point-left.png"
          alt=""
          width={264}
          height={480}
          className="pointer-events-none absolute bottom-0 left-full ml-3 hidden h-44 w-auto select-none lg:block"
        />
      </div>
    </section>
  );
}

"use client";

import { useSyncExternalStore } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Segmented } from "@/components/segmented";
import type { Dictionary } from "@/lib/i18n";

type Theme = "light" | "dark" | "system";

const subscribe = () => () => {};

export function ThemeToggle({ labels }: { labels: Dictionary["header"] }) {
  const { theme, setTheme } = useTheme();
  // 서버에서는 저장된 테마를 모르므로 hydration 뒤에만 고른 것을 표시한다.
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  return (
    <Segmented<Theme>
      label={labels.theme}
      value={mounted ? (theme as Theme | undefined) : undefined}
      onChange={setTheme}
      options={[
        { value: "light", label: labels.light, content: <Sun /> },
        { value: "dark", label: labels.dark, content: <Moon /> },
        { value: "system", label: labels.system, content: <Monitor /> },
      ]}
    />
  );
}

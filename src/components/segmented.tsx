"use client";

import type { ReactNode } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type Option<T extends string> = { value: T; label: string; content: ReactNode };

/** 헤더의 화면 모드·언어를 고르는 세그먼트 토글. 하나는 항상 골라져 있다. */
export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T | undefined;
  options: Option<T>[];
  onChange: (value: T) => void;
}) {
  return (
    <ToggleGroup
      aria-label={label}
      value={value ? [value] : []}
      // 이미 골라진 것을 다시 누르면 빈 배열이 오므로 무시한다.
      onValueChange={(next) => next[0] && onChange(next[0] as T)}
      spacing={0}
      size="sm"
      className="bg-muted gap-0.5 p-0.5"
    >
      {options.map((option) => (
        <ToggleGroupItem
          key={option.value}
          value={option.value}
          aria-label={option.label}
          title={option.label}
          className="text-muted-foreground aria-pressed:bg-background aria-pressed:text-foreground h-7 min-w-7 rounded-md! px-2 text-xs aria-pressed:shadow-sm"
        >
          {option.content}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

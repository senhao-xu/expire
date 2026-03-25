import { useEffect, useRef } from "react";

interface Props {
  items: string[];
  value: string;
  onChange: (value: string) => void;
  itemHeight?: number;
}

export function WheelPicker({ items, value, onChange, itemHeight = 40 }: Props) {
  const listRef = useRef<HTMLUListElement>(null);
  const visibleCount = 5;
  const containerHeight = itemHeight * visibleCount;
  const selectedIdx = items.indexOf(value);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ top: selectedIdx * itemHeight, behavior: "smooth" });
  }, [selectedIdx, itemHeight]);

  const handleScroll = () => {
    const el = listRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollTop / itemHeight);
    const clamped = Math.max(0, Math.min(idx, items.length - 1));
    if (items[clamped] !== value) onChange(items[clamped]);
  };

  return (
    <div className="relative overflow-hidden" style={{ height: containerHeight }}>
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between">
        <div className="h-[80px] bg-gradient-to-b from-white to-transparent" />
        <div className="border-y-2 border-gray-200" style={{ height: itemHeight }} />
        <div className="h-[80px] bg-gradient-to-t from-white to-transparent" />
      </div>
      <ul
        ref={listRef}
        onScroll={handleScroll}
        className="overflow-y-scroll overscroll-none"
        style={{
          height: containerHeight,
          scrollSnapType: "y mandatory",
          paddingTop: itemHeight * 2,
          paddingBottom: itemHeight * 2,
          listStyle: "none",
          margin: 0,
          padding: `${itemHeight * 2}px 0`,
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {items.map((item) => (
          <li
            key={item}
            style={{
              height: itemHeight,
              scrollSnapAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              color: item === value ? "#111" : "#aaa",
              fontWeight: item === value ? 600 : 400,
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

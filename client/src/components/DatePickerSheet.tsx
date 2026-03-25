import { useState } from "react";
import { WheelPicker } from "./WheelPicker";

interface Props {
  open: boolean;
  value: string;
  onConfirm: (date: string) => void;
  onCancel: () => void;
}

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 20 }, (_, i) => String(currentYear - 2 + i));
const MONTHS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function DatePickerSheet({ open, value, onConfirm, onCancel }: Props) {
  const [year, month, day] = value.split("-");
  const [y, setY] = useState(year ?? String(currentYear));
  const [m, setM] = useState(month ?? "01");
  const [d, setD] = useState(day ?? "01");

  if (!open) return null;

  const count = daysInMonth(Number(y), Number(m));
  const days = Array.from({ length: count }, (_, i) => String(i + 1).padStart(2, "0"));
  const clampedDay = String(Math.min(Number(d), count)).padStart(2, "0");

  const handleConfirm = () => onConfirm(`${y}-${m}-${clampedDay}`);

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="absolute bottom-0 left-0 right-0 max-w-2xl mx-auto">
        <div className="bg-white rounded-t-2xl">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <button className="text-gray-500 text-sm" onClick={onCancel}>取消</button>
          <span className="font-medium text-gray-900">选择日期</span>
          <button className="text-[#22C55E] text-sm font-medium" onClick={handleConfirm}>确认</button>
        </div>
        <div className="flex px-4 py-2">
          <div className="flex-1">
            <WheelPicker items={YEARS} value={y} onChange={setY} />
          </div>
          <div className="w-14 text-center self-center text-gray-300">年</div>
          <div className="flex-1">
            <WheelPicker items={MONTHS} value={m} onChange={setM} />
          </div>
          <div className="w-14 text-center self-center text-gray-300">月</div>
          <div className="flex-1">
            <WheelPicker items={days} value={clampedDay} onChange={setD} />
          </div>
          <div className="w-14 text-center self-center text-gray-300">日</div>
        </div>
        </div>
      </div>
    </div>
  );
}

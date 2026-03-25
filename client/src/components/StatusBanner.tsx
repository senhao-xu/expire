import { STATUS_COLOR, computeStatus, computeRemainingDays } from "../utils/asset";

export function StatusBanner({ expireDate }: { expireDate: string }) {
  const status = computeStatus(expireDate);
  const days = computeRemainingDays(expireDate);
  const color = STATUS_COLOR[status];

  const text = days < 0
    ? `已过期 ${Math.abs(days)} 天`
    : days === 0
    ? "今日到期"
    : days <= 7
    ? `还有 ${days} 天到期`
    : `正常，还有 ${days} 天`;

  return (
    <div className="w-full py-3 px-4 text-white text-center text-sm font-medium" style={{ backgroundColor: color }}>
      {text}
    </div>
  );
}

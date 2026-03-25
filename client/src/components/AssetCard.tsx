import type { Asset } from "../types";
import {
  ASSET_TYPE_LABEL, STATUS_COLOR,
  computeStatus, computeRemainingDays, computeDailyCost,
} from "../utils/asset";

interface Props {
  asset: Asset;
  onClick?: () => void;
}

export function AssetCard({ asset, onClick }: Props) {
  const status = computeStatus(asset.expireDate);
  const days = computeRemainingDays(asset.expireDate);
  const color = STATUS_COLOR[status];
  const dailyCost = asset.price != null && asset.cycle != null
    ? computeDailyCost(asset.price, asset.cycle, asset.cycleDays)
    : null;

  const daysText = days < 0 ? `已过期 ${Math.abs(days)} 天` : `${days} 天后到期`;

  return (
    <div
      onClick={onClick}
      className="bg-white mx-4 my-2 rounded-lg p-4 relative overflow-hidden cursor-pointer active:opacity-80 shadow-sm"
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg" style={{ backgroundColor: color }} />
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900 truncate">{asset.name}</div>
          <span className="inline-block mt-1 px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[11px] rounded">
            {ASSET_TYPE_LABEL[asset.type] ?? asset.type}
          </span>
        </div>
        <div className="text-right ml-3 shrink-0">
          <div className="text-sm font-medium" style={{ color }}>{daysText}</div>
          <div className="text-xs text-gray-400 mt-0.5">{asset.expireDate}</div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-3 text-xs text-gray-400">
        <span>{asset.provider}</span>
        {dailyCost !== null && asset.price !== null && (
          <span>
            {asset.currency} {asset.price} · 日均 {dailyCost.toFixed(2)}
          </span>
        )}
      </div>
    </div>
  );
}

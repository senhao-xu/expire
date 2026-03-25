import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Trash2, Pencil, RefreshCw } from "lucide-react";
import { deleteAsset, fetchAssetDetail, recordRenewal } from "../api/index";
import type { AssetDetail } from "../types";
import { Layout } from "../components/Layout";
import { StatusBanner } from "../components/StatusBanner";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { RenewalDialog } from "../components/RenewalDialog";
import { ASSET_TYPE_LABEL, CYCLE_LABEL } from "../utils/asset";

function monthKey(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}年${d.getMonth() + 1}月`;
}

export function AssetDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [asset, setAsset]         = useState<AssetDetail | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [showRenew, setShowRenew]   = useState(false);

  const reload = () => fetchAssetDetail(id!).then(setAsset).catch(console.error);

  useEffect(() => { reload(); }, [id]);

  if (!asset) return null;

  const handleDelete = async () => {
    await deleteAsset(id!);
    navigate(-1);
  };

  const handleRenew = async (amount: number, currency: string, notes: string) => {
    await recordRenewal(id!, { amount, currency, notes: notes || undefined });
    setShowRenew(false);
    reload();
  };

  // Group renewal records by month
  const grouped = asset.renewalRecords.reduce<Record<string, typeof asset.renewalRecords>>((acc, r) => {
    const key = monthKey(r.renewedAt);
    (acc[key] ??= []).push(r);
    return acc;
  }, {});

  const cycleText = !asset.cycle ? "-"
    : asset.cycle === "custom" ? `${asset.cycleDays ?? "?"} 天`
    : CYCLE_LABEL[asset.cycle];

  return (
    <Layout showNav={false}>
      {/* Header */}
      <div className="flex items-center px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="mr-3 text-gray-600"><ArrowLeft size={22} /></button>
        <h1 className="text-base font-semibold text-gray-900 flex-1 truncate">{asset.name}</h1>
      </div>

      <StatusBanner expireDate={asset.expireDate} />

      {/* Basic Info */}
      <div className="bg-white mx-4 mt-3 rounded-2xl overflow-hidden">
        {[
          { label: "类型",   value: ASSET_TYPE_LABEL[asset.type] ?? asset.type },
          { label: "服务商", value: asset.provider },
          { label: "到期日", value: asset.expireDate },
          { label: "价格",   value: asset.price != null ? `${asset.price} ${asset.currency}` : "-" },
          { label: "周期",   value: cycleText },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between items-center px-4 py-3 border-b border-gray-50 last:border-0">
            <span className="text-sm text-gray-500">{label}</span>
            <span className="text-sm text-gray-900">{value}</span>
          </div>
        ))}
        {asset.notes && (
          <div className="px-4 py-3 border-t border-gray-50">
            <div className="text-sm text-gray-500 mb-1">备注</div>
            <div className="text-sm text-gray-800 whitespace-pre-wrap">{asset.notes}</div>
          </div>
        )}
      </div>

      {/* Renewal Records */}
      <div className="mx-4 mt-3 mb-24">
        <div className="font-semibold text-gray-900 mb-2 text-sm">续费记录</div>
        {Object.keys(grouped).length === 0 ? (
          <div className="text-center text-gray-400 text-sm py-6">暂无续费记录</div>
        ) : (
          Object.entries(grouped).map(([month, records]) => (
            <div key={month} className="mb-3">
              <div className="text-xs text-gray-400 mb-1">{month}</div>
              {records.map((r) => (
                <div key={r.id} className="bg-white rounded-2xl px-4 py-3 mb-1.5 flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-800">{r.renewedAt.slice(0, 10)}</div>
                    {r.notes && <div className="text-xs text-gray-400 mt-0.5">{r.notes}</div>}
                  </div>
                  <div className="text-sm font-medium text-[#22C55E]">{r.amount} {r.currency}</div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40">
        <div className="max-w-2xl mx-auto flex gap-3 px-4 py-3">
        <button onClick={() => setShowDelete(true)} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-50 text-[#EF4444] text-sm">
          <Trash2 size={16} /> 删除
        </button>
        <button onClick={() => navigate(`/assets/${id}/edit`)} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-sm">
          <Pencil size={16} /> 编辑
        </button>
        <button onClick={() => setShowRenew(true)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#22C55E] text-white text-sm font-medium">
          <RefreshCw size={16} /> 续费
        </button>
        </div>
      </div>

      <ConfirmDialog
        open={showDelete}
        title="确认删除"
        message="删除后将无法恢复该资产及其续费记录"
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
      <RenewalDialog
        open={showRenew}
        defaultAmount={asset.price}
        defaultCurrency={asset.currency}
        onConfirm={handleRenew}
        onCancel={() => setShowRenew(false)}
      />
    </Layout>
  );
}

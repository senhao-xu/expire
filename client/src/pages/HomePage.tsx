import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { fetchAssets, fetchStats, type AssetsQuery } from "../api/index";
import type { Asset, Stats } from "../types";
import { Layout } from "../components/Layout";
import { AssetCard } from "../components/AssetCard";
import { ASSET_TYPE_LABEL } from "../utils/asset";

const STATUS_OPTIONS = [
  { value: "", label: "全部状态" },
  { value: "expired",  label: "已过期" },
  { value: "urgent",   label: "紧急" },
  { value: "upcoming", label: "即将到期" },
  { value: "normal",   label: "正常" },
];

export function HomePage() {
  const navigate = useNavigate();
  const [assets, setAssets]     = useState<Asset[]>([]);
  const [stats, setStats]       = useState<Stats | null>(null);
  const [search, setSearch]     = useState("");
  const [type, setType]         = useState("");
  const [status, setStatus]     = useState("");
  const searchTimer = useRef<ReturnType<typeof setTimeout>>();

  const load = (q: AssetsQuery) => {
    fetchAssets(q).then(setAssets).catch(console.error);
    fetchStats().then(setStats).catch(console.error);
  };

  useEffect(() => {
    load({ search: search || undefined, type: type || undefined, status: status || undefined });
  }, [type, status]);

  const handleSearch = (v: string) => {
    setSearch(v);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      load({ search: v || undefined, type: type || undefined, status: status || undefined });
    }, 400);
  };

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white sticky top-0 z-10 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-900">到期啦</h1>
        <button onClick={() => navigate("/assets/new")} className="p-1.5 text-gray-600">
          <Plus size={22} />
        </button>
      </div>

      {/* Search + Filters */}
      <div className="bg-white px-4 pt-3 pb-2 space-y-2">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="搜索资产名称"
            className="w-full pl-9 pr-3 py-2 bg-gray-100 rounded-lg text-sm outline-none"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="flex-1 bg-gray-100 rounded-lg px-2 py-1.5 text-sm outline-none text-gray-700"
          >
            <option value="">全部类型</option>
            {Object.entries(ASSET_TYPE_LABEL).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="flex-1 bg-gray-100 rounded-lg px-2 py-1.5 text-sm outline-none text-gray-700"
          >
            {STATUS_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-4 bg-white mt-1 border-b border-gray-100">
          {[
            { label: "总计",   count: stats.total,    color: "#374151" },
            { label: "已过期", count: stats.expired,  color: "#EF4444" },
            { label: "紧急",   count: stats.urgent,   color: "#F97316" },
            { label: "即将",   count: stats.upcoming, color: "#EAB308" },
          ].map(({ label, count, color }) => (
            <div key={label} className="flex flex-col items-center py-3">
              <span className="text-lg font-bold" style={{ color }}>{count}</span>
              <span className="text-xs text-gray-400 mt-0.5">{label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Asset List */}
      <div className="pt-2 pb-6">
        {assets.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">暂无资产，点击右下角添加</div>
        ) : (
          assets.map((a) => (
            <AssetCard key={a.id} asset={a} onClick={() => navigate(`/assets/${a.id}`)} />
          ))
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => navigate("/assets/new")}
        className="fixed right-4 bottom-20 w-14 h-14 bg-[#22C55E] text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 z-40"
      >
        <Plus size={28} />
      </button>
    </Layout>
  );
}

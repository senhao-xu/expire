import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { createAsset, fetchAssetDetail, updateAsset } from "../api/index";
import type { Asset, AssetType, Currency, RenewalCycle } from "../types";
import { Layout } from "../components/Layout";
import { DatePickerSheet } from "../components/DatePickerSheet";
import { OptionPickerSheet } from "../components/OptionPickerSheet";
import { ASSET_TYPE_LABEL, CYCLE_LABEL } from "../utils/asset";

const TYPE_OPTIONS = Object.entries(ASSET_TYPE_LABEL).map(([value, label]) => ({ value, label }));
const CYCLE_OPTIONS = Object.entries(CYCLE_LABEL).map(([value, label]) => ({ value, label }));
const CURRENCY_OPTIONS = ["CNY", "USD", "EUR", "HKD"].map((v) => ({ value: v, label: v }));

type Form = {
  name: string; type: AssetType; provider: string; expireDate: string;
  price: string; currency: Currency; cycle: RenewalCycle | ""; cycleDays: string; notes: string;
};

const INITIAL: Form = {
  name: "", type: "other", provider: "", expireDate: "",
  price: "", currency: "CNY", cycle: "", cycleDays: "", notes: "",
};

export function AssetFormPage() {
  const navigate = useNavigate();
  const { id }   = useParams<{ id: string }>();
  const isEdit   = !!id;

  const [form, setForm]     = useState<Form>(INITIAL);
  const [picker, setPicker] = useState<"type" | "currency" | "cycle" | "date" | null>(null);

  useEffect(() => {
    if (isEdit) {
      fetchAssetDetail(id!).then((a) => {
        setForm({
          name:       a.name,
          type:       a.type,
          provider:   a.provider,
          expireDate: a.expireDate,
          price:      a.price != null ? String(a.price) : "",
          currency:   a.currency,
          cycle:      a.cycle ?? "",
          cycleDays:  a.cycleDays != null ? String(a.cycleDays) : "",
          notes:      a.notes ?? "",
        });
      }).catch(console.error);
    }
  }, [id, isEdit]);

  const set = (k: keyof Form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.name || !form.type || !form.provider || !form.expireDate) {
      alert("请填写必填项：名称、类型、服务商、到期日期");
      return;
    }
    const payload: Omit<Asset, "id" | "createdAt" | "updatedAt"> = {
      name: form.name, type: form.type, provider: form.provider,
      expireDate: form.expireDate,
      price: form.price ? parseFloat(form.price) : null,
      currency: form.currency,
      cycle: (form.cycle as RenewalCycle) || null,
      cycleDays: (form.cycle === "custom" && form.cycleDays) ? parseInt(form.cycleDays) : null,
      notes: form.notes || null,
    };
    try {
      if (isEdit) await updateAsset(id!, payload);
      else        await createAsset(payload);
      navigate(-1);
    } catch (e) {
      alert((e as Error).message ?? "保存失败");
    }
  };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <Layout showNav={false}>
      <div className="flex items-center px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="mr-3 text-gray-600"><ArrowLeft size={22} /></button>
        <h1 className="text-base font-semibold text-gray-900">{isEdit ? "编辑资产" : "新增资产"}</h1>
      </div>

      <div className="px-4 py-4 space-y-3 pb-24">
        <div className="bg-white rounded-2xl px-4 py-2">
          {[
            { label: "资产名称 *", placeholder: "如：阿里云服务器", key: "name" as const },
            { label: "服务商 *", placeholder: "如：阿里云 / 腾讯云", key: "provider" as const },
          ].map(({ label, placeholder, key }) => (
            <div key={key} className="py-3 border-b border-gray-50">
              <div className="text-xs text-gray-500 mb-1">{label}</div>
              <input type="text" value={form[key]} onChange={(e) => set(key, e.target.value)} placeholder={placeholder} className="w-full text-sm text-gray-900 outline-none bg-transparent" />
            </div>
          ))}
          <div className="py-3 border-b border-gray-50">
            <div className="text-xs text-gray-500 mb-1">资产类型 *</div>
            <div onClick={() => setPicker("type")} className="text-sm text-gray-900 cursor-pointer">{ASSET_TYPE_LABEL[form.type] ?? "请选择"}</div>
          </div>
          <div className="py-3">
            <div className="text-xs text-gray-500 mb-1">到期日期 *</div>
            <div onClick={() => setPicker("date")} className="text-sm cursor-pointer">
              {form.expireDate ? <span className="text-gray-900">{form.expireDate}</span> : <span className="text-gray-400">选择日期</span>}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl px-4 py-2">
          <div className="py-3 border-b border-gray-50">
            <div className="text-xs text-gray-500 mb-1">续费价格</div>
            <div className="flex items-center gap-2">
              <input type="number" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="0.00" className="flex-1 text-sm outline-none bg-transparent" />
              <div onClick={() => setPicker("currency")} className="text-sm text-gray-600 cursor-pointer px-2 py-0.5 bg-gray-100 rounded">{form.currency}</div>
            </div>
          </div>
          <div className="py-3 border-b border-gray-50">
            <div className="text-xs text-gray-500 mb-1">续费周期</div>
            <div onClick={() => setPicker("cycle")} className="text-sm cursor-pointer">
              {form.cycle ? <span className="text-gray-900">{CYCLE_LABEL[form.cycle as RenewalCycle]}</span> : <span className="text-gray-400">选择周期（选填）</span>}
            </div>
          </div>
          {form.cycle === "custom" && (
            <div className="py-3 border-b border-gray-50">
              <div className="text-xs text-gray-500 mb-1">自定义天数</div>
              <input type="number" value={form.cycleDays} onChange={(e) => set("cycleDays", e.target.value)} placeholder="输入天数" className="w-full text-sm outline-none bg-transparent" />
            </div>
          )}
          <div className="py-3">
            <div className="text-xs text-gray-500 mb-1">备注</div>
            <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="添加备注（选填）" rows={3} className="w-full text-sm outline-none bg-transparent resize-none" />
          </div>
        </div>

        <button onClick={handleSubmit} className="w-full py-3 bg-[#22C55E] text-white rounded-xl font-medium text-sm">
          保存
        </button>
      </div>

      <OptionPickerSheet open={picker === "type"} title="资产类型" options={TYPE_OPTIONS} value={form.type} onSelect={(v) => set("type", v as AssetType)} onCancel={() => setPicker(null)} />
      <OptionPickerSheet open={picker === "currency"} title="货币" options={CURRENCY_OPTIONS} value={form.currency} onSelect={(v) => set("currency", v as Currency)} onCancel={() => setPicker(null)} />
      <OptionPickerSheet open={picker === "cycle"} title="续费周期" options={CYCLE_OPTIONS} value={form.cycle} onSelect={(v) => set("cycle", v as RenewalCycle)} onCancel={() => setPicker(null)} />
      <DatePickerSheet open={picker === "date"} value={form.expireDate || today} onConfirm={(v) => { set("expireDate", v); setPicker(null); }} onCancel={() => setPicker(null)} />
    </Layout>
  );
}

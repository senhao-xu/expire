import { useEffect, useState } from "react";

interface Props {
  open: boolean;
  defaultAmount?: number | null;
  defaultCurrency?: string;
  onConfirm: (amount: number, currency: string, notes: string) => void;
  onCancel: () => void;
}

const CURRENCIES = ["CNY", "USD", "EUR", "HKD"];

export function RenewalDialog({ open, defaultAmount, defaultCurrency = "CNY", onConfirm, onCancel }: Props) {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState(defaultCurrency);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (open) {
      setAmount(defaultAmount != null ? String(defaultAmount) : "");
      setCurrency(defaultCurrency);
      setNotes("");
    }
  }, [open, defaultAmount, defaultCurrency]);

  if (!open) return null;

  const handleConfirm = () => {
    const n = parseFloat(amount);
    if (!n || n <= 0) return;
    onConfirm(n, currency, notes);
  };

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="absolute bottom-0 left-0 right-0 max-w-2xl mx-auto">
        <div className="bg-white rounded-t-2xl p-5 space-y-4">
        <h3 className="font-semibold text-gray-900 text-center">记录续费</h3>
        <div>
          <label className="text-xs text-gray-500 block mb-1">金额</label>
          <div className="flex border border-gray-200 rounded-lg overflow-hidden">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-gray-50 px-2 text-sm outline-none border-r border-gray-200"
            >
              {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="flex-1 px-3 py-2.5 text-sm outline-none"
            />
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">备注（选填）</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="续费备注"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none resize-none"
          />
        </div>
        <div className="flex gap-3 pt-1">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-600 text-sm">
            取消
          </button>
          <button onClick={handleConfirm} className="flex-1 py-2.5 rounded-xl bg-[#22C55E] text-white text-sm font-medium">
            续费
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}

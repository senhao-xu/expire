interface Option {
  value: string;
  label: string;
}

interface Props {
  open: boolean;
  title: string;
  options: Option[];
  value: string;
  onSelect: (value: string) => void;
  onCancel: () => void;
}

export function OptionPickerSheet({ open, title, options, value, onSelect, onCancel }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="absolute bottom-0 left-0 right-0 max-w-2xl mx-auto">
        <div className="bg-white rounded-t-2xl max-h-[60vh] flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
          <button className="text-gray-500 text-sm" onClick={onCancel}>取消</button>
          <span className="font-medium text-gray-900">{title}</span>
          <div className="w-10" />
        </div>
        <ul className="overflow-y-auto">
          {options.map((opt) => (
            <li
              key={opt.value}
              onClick={() => { onSelect(opt.value); onCancel(); }}
              className={`px-4 py-3.5 text-sm border-b border-gray-50 cursor-pointer active:bg-gray-50 flex justify-between items-center ${opt.value === value ? "text-[#22C55E] font-medium" : "text-gray-700"}`}
            >
              <span>{opt.label}</span>
              {opt.value === value && <span className="text-[#22C55E]">✓</span>}
            </li>
          ))}
        </ul>
        </div>
      </div>
    </div>
  );
}

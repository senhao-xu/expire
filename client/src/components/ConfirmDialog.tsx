interface Props {
  open: boolean;
  title: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ open, title, message, onConfirm, onCancel }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="bg-white w-4/5 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-6 pt-6 pb-4 text-center">
          <div className="font-semibold text-gray-900 text-base">{title}</div>
          {message && <div className="text-sm text-gray-500 mt-1.5">{message}</div>}
        </div>
        <div className="flex border-t border-gray-100">
          <button onClick={onCancel} className="flex-1 py-3.5 text-gray-500 text-sm border-r border-gray-100 active:bg-gray-50">
            取消
          </button>
          <button onClick={onConfirm} className="flex-1 py-3.5 text-[#EF4444] text-sm font-medium active:bg-red-50">
            确认删除
          </button>
        </div>
      </div>
    </div>
  );
}

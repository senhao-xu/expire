import { useRef } from "react";
import { exportData, importData } from "../api/index";
import { Layout } from "../components/Layout";
import { Download, Upload } from "lucide-react";

export function SettingsPage() {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleExport = () => exportData().catch((e) => alert((e as Error).message));

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await importData(file);
      alert(`导入成功：${result.imported} 条资产`);
      e.target.value = "";
    } catch (err) {
      alert((err as Error).message ?? "导入失败");
    }
  };

  return (
    <Layout>
      <div className="px-4 py-10 flex flex-col items-center">
        <div className="w-16 h-16 bg-[#22C55E] rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-3">
          到
        </div>
        <h1 className="text-xl font-bold text-gray-900">到期啦</h1>
        <p className="text-sm text-gray-400 mt-1">v1.0.0</p>
      </div>

      <div className="px-4 space-y-2">
        <button onClick={handleExport} className="w-full flex items-center gap-3 p-4 bg-white rounded-xl">
          <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center text-[#22C55E]">
            <Download size={18} />
          </div>
          <span className="text-sm font-medium text-gray-900">导出数据</span>
        </button>

        <button onClick={() => fileRef.current?.click()} className="w-full flex items-center gap-3 p-4 bg-white rounded-xl">
          <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">
            <Upload size={18} />
          </div>
          <span className="text-sm font-medium text-gray-900">导入数据</span>
        </button>

        <input ref={fileRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
      </div>
    </Layout>
  );
}

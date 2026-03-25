import type { Asset, AssetDetail, RenewalRecord, Stats } from "../types";

const BASE = "/api/v1";

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(BASE + path, init);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? res.statusText);
  }
  return res.json();
}

export interface AssetsQuery {
  search?: string;
  type?: string;
  status?: string;
}

export function fetchAssets(query?: AssetsQuery): Promise<Asset[]> {
  const params = new URLSearchParams();
  if (query?.search) params.set("search", query.search);
  if (query?.type)   params.set("type", query.type);
  if (query?.status) params.set("status", query.status);
  const qs = params.toString();
  return req<Asset[]>(`/assets${qs ? "?" + qs : ""}`);
}

export function fetchAssetDetail(id: string): Promise<AssetDetail> {
  return req<AssetDetail>(`/assets/${id}`);
}

export function createAsset(data: Omit<Asset, "id" | "createdAt" | "updatedAt">): Promise<Asset> {
  const body = {
    name: data.name, type: data.type, provider: data.provider,
    expire_date: data.expireDate, price: data.price, currency: data.currency,
    cycle: data.cycle, cycle_days: data.cycleDays, notes: data.notes,
  };
  return req<Asset>("/assets", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
}

export function updateAsset(id: string, data: Partial<Omit<Asset, "id" | "createdAt" | "updatedAt">>): Promise<Asset> {
  const body: Record<string, unknown> = {};
  if (data.name !== undefined)       body.name = data.name;
  if (data.type !== undefined)       body.type = data.type;
  if (data.provider !== undefined)   body.provider = data.provider;
  if (data.expireDate !== undefined) body.expire_date = data.expireDate;
  if (data.price !== undefined)      body.price = data.price;
  if (data.currency !== undefined)   body.currency = data.currency;
  if (data.cycle !== undefined)      body.cycle = data.cycle;
  if (data.cycleDays !== undefined)  body.cycle_days = data.cycleDays;
  if (data.notes !== undefined)      body.notes = data.notes;
  return req<Asset>(`/assets/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
}

export function deleteAsset(id: string): Promise<{ success: boolean }> {
  return req<{ success: boolean }>(`/assets/${id}`, { method: "DELETE" });
}

export function recordRenewal(assetId: string, data: { amount: number; currency: string; notes?: string }): Promise<RenewalRecord> {
  return req<RenewalRecord>(`/assets/${assetId}/renew`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
}

export function fetchStats(): Promise<Stats> {
  return req<Stats>("/stats");
}

export async function exportData(): Promise<void> {
  const res = await fetch(`${BASE}/export`);
  if (!res.ok) throw new Error("Export failed");
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `expire-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importData(file: File): Promise<{ imported: number }> {
  const text = await file.text();
  const data = JSON.parse(text);
  return req<{ imported: number }>("/import", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
}

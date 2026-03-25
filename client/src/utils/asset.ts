import type { AssetStatus, RenewalCycle } from "../types";

export function computeRemainingDays(expireDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expire = new Date(expireDate);
  expire.setHours(0, 0, 0, 0);
  return Math.ceil((expire.getTime() - today.getTime()) / 86400000);
}

export function computeStatus(expireDate: string): AssetStatus {
  const days = computeRemainingDays(expireDate);
  if (days < 0)   return "expired";
  if (days <= 7)  return "urgent";
  if (days <= 30) return "upcoming";
  return "normal";
}

const CYCLE_DAYS: Record<RenewalCycle, number> = {
  daily:      1,
  weekly:     7,
  biweekly:   15,
  monthly:    30,
  semiannual: 182,
  annual:     365,
  biannual:   730,
  custom:     0,
};

export function computeDailyCost(price: number, cycle: RenewalCycle, cycleDays?: number | null): number {
  const days = cycle === "custom" ? (cycleDays ?? 1) : CYCLE_DAYS[cycle];
  return days > 0 ? price / days : 0;
}

export const STATUS_COLOR: Record<AssetStatus, string> = {
  expired:  "#EF4444",
  urgent:   "#F97316",
  upcoming: "#EAB308",
  normal:   "#22C55E",
};

export const STATUS_LABEL: Record<AssetStatus, string> = {
  expired:  "已过期",
  urgent:   "紧急",
  upcoming: "即将到期",
  normal:   "正常",
};

export const ASSET_TYPE_LABEL: Record<string, string> = {
  server:     "服务器",
  domain:     "域名",
  cdn:        "CDN",
  ssl:        "SSL证书",
  storage:    "对象存储",
  database:   "数据库",
  email:      "邮件服务",
  sms:        "短信服务",
  monitor:    "监控服务",
  collab:     "协作工具",
  design:     "设计工具",
  devtool:    "开发工具",
  cloud_drive:"云盘网盘",
  other:      "其他",
};

export const CYCLE_LABEL: Record<RenewalCycle, string> = {
  daily:      "每天",
  weekly:     "每周",
  biweekly:   "每半月",
  monthly:    "每月",
  semiannual: "每半年",
  annual:     "每年",
  biannual:   "每两年",
  custom:     "自定义",
};

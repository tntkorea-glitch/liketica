import { decrypt } from "./crypto";

export interface ProxyRecord {
  protocol: string;
  host: string;
  port: number;
  username: string | null;
  password: string | null;
}

export function buildProxyUrl(p: ProxyRecord): string {
  const pw = p.password ? decrypt(p.password) : "";
  const auth = p.username
    ? `${encodeURIComponent(p.username)}${pw ? `:${encodeURIComponent(pw)}` : ""}@`
    : "";
  return `${p.protocol}://${auth}${p.host}:${p.port}`;
}

const BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ?? "";

interface Opts extends RequestInit { token?: string }

export async function request<T>(path: string, opts: Opts = {}): Promise<T> {
  const { token, headers, ...rest } = opts;
  const res = await fetch(`${BASE}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers ?? {}),
    },
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    let msg = "Request failed.";
    if (typeof data === "string") msg = data;
    else if (data?.detail) msg = data.detail;
    else if (data && typeof data === "object") {
      const first = Object.values(data)[0];
      msg = Array.isArray(first) ? String(first[0]) : typeof first === "string" ? first : msg;
    }
    throw new Error(msg);
  }
  return data as T;
}

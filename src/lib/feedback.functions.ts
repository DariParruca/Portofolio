const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:5000";

export type FeedbackRow = {
  id: string;
  name: string;
  email: string | null;
  rating: number;
  message: string;
  createdAt: string;
};

export async function submitFeedback({ data }: {
  data: { name: string; email?: string; rating: number; message: string; company?: string; dwellMs?: number };
}): Promise<{ ok: boolean }> {
  const r = await fetch(`${API_URL}/api/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: data.name,
      email: data.email || null,
      rating: data.rating,
      message: data.message,
      company: data.company ?? "",
      dwellMs: data.dwellMs,
    }),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function getFeedbackAdmin({ data }: {
  data: { key: string };
}): Promise<{ feedback: FeedbackRow[]; cvDownloads: number }> {
  const r = await fetch(`${API_URL}/api/feedback/admin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key: data.key }),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function trackCvDownload({ data }: {
  data: { userAgent?: string; referrer?: string };
}): Promise<{ count: number }> {
  const r = await fetch(`${API_URL}/api/cv-download`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userAgent: data.userAgent, referrer: data.referrer }),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function getCvDownloadCount(): Promise<{ count: number }> {
  const r = await fetch(`${API_URL}/api/cv-download/count`);
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

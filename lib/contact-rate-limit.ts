import { createHash } from "node:crypto";

// Per-process defense in depth. Production must also enforce limits at the edge.
const buckets = new Map<string, { hits: number; expires: number }>();
const windowMs = 600_000;
export function allowContactRequest(request: Request, now = Date.now()) {
  const header = process.env.TRUSTED_CLIENT_IP_HEADER;
  const client = header ? request.headers.get(header)?.split(",")[0]?.trim() : undefined;
  const key = createHash("sha256").update(client || "shared").digest("hex");
  for (const [id, bucket] of buckets) if (bucket.expires <= now) buckets.delete(id);
  let bucket = buckets.get(key);
  if (!bucket) {
    if (buckets.size >= 10000) return false;
    bucket = { hits: 0, expires: now + windowMs };
    buckets.set(key, bucket);
  }
  return ++bucket.hits <= 5;
}

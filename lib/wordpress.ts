import "server-only";
const baseUrl = process.env.WP_API_URL;

export async function wpFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  if (!baseUrl) {
    throw new Error("WP_API_URL missing");
  }

  const url = `${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
  if (process.env.NODE_ENV === "production" && new URL(url).protocol !== "https:") {
    throw new Error("WP_API_URL must use HTTPS");
  }

  const res = await fetch(url, {
    ...options,
    redirect: "error",
    signal: options.signal ?? AbortSignal.timeout(15000),

    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },

    next:
      options.method && options.method !== "GET"
        ? undefined
        : {
            revalidate: 60,
          },
  });

  if (!res.ok) {
    throw new Error(`WordPress API error: ${res.status}`);
  }

  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    throw new Error(
      `WordPress API returned ${contentType || "an unknown content type"} instead of JSON. Check WP_API_URL and the WordPress REST API.`
    );
  }

  return res.json() as Promise<T>;
}

const baseUrl = process.env.WP_API_URL;

export async function wpFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  if (!baseUrl) {
    throw new Error("WP_API_URL missing");
  }

  const url = `${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;

  const res = await fetch(url, {
    ...options,

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
    const errorText = await res.text();

    throw new Error(
      `WordPress API error: ${res.status} ${errorText}`
    );
  }

  return res.json() as Promise<T>;
}
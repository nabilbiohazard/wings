export function isAllowedRequestOrigin(
  request: Request,
  configuredUrl: string | undefined,
  development: boolean,
) {
  if (!development && !configuredUrl) return false;
  try {
    const expected = new URL(development ? request.url : configuredUrl!);
    if (!development && expected.protocol !== "https:") return false;
    return request.headers.get("origin") === expected.origin;
  } catch {
    return false;
  }
}

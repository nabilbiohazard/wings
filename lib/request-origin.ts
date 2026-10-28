export function isAllowedRequestOrigin(
  request: Request,
  configuredUrl: string | undefined,
  development: boolean,
) {
  const expected = new URL(
    development ? request.url : configuredUrl || request.url,
  ).origin;
  return request.headers.get("origin") === expected;
}

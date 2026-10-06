const headerColors: Record<string, string> = {
  shop: "#302332",
  "custom-design": "#283a40",
  collections: "#263b34",
  about: "#40302b",
  blog: "#30354b",
  contact: "#422b35",
};

export function getHeaderColor(pathname: string) {
  return headerColors[pathname.split("/")[1]] ?? "#29252f";
}

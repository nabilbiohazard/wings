type CharmAttachmentData = {
  id: string | number;
  name: string;
  image: string;
  attachment?: { x: number; y: number };
};

// The smaller chocolate artwork has more empty space above its connector.
export function chocolateAttachment(charm: Pick<CharmAttachmentData, "id" | "name" | "image">) {
  return charm.id === "chocolate" || /choco(?:late)?|شکلات/i.test(charm.name) || /photo_7_2026-10-01_15-40-19/.test(charm.image)
    ? { x: 43, y: 43 }
    : undefined;
}


import sanitizeHtml from "sanitize-html";

export function sanitizePostContent(html: string) {
  return sanitizeHtml(html, {
    allowedTags: [
      ...sanitizeHtml.defaults.allowedTags,
      "img",
      "figure",
      "figcaption",
      "video",
      "audio",
      "source",
      "iframe",
      "hr",
    ],
    allowedAttributes: {
      "*": ["class", "id", "dir", "lang", "style"],
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "width", "height", "srcset", "sizes", "loading"],
      iframe: [
        "src",
        "title",
        "width",
        "height",
        "allow",
        "allowfullscreen",
        "loading",
        "referrerpolicy",
      ],
      video: ["src", "controls", "poster", "width", "height", "preload"],
      audio: ["src", "controls", "preload"],
      source: ["src", "type", "srcset", "sizes"],
      th: ["scope", "colspan", "rowspan"],
      td: ["colspan", "rowspan"],
      ol: ["start", "reversed", "type"],
      li: ["value"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedIframeHostnames: [
      "www.youtube.com",
      "www.youtube-nocookie.com",
      "player.vimeo.com",
      "open.spotify.com",
      "w.soundcloud.com",
      "www.google.com",
      "maps.google.com",
      "api.testvedad.ir",
    ],
    allowIframeRelativeUrls: true,
    allowedStyles: {
      "*": {
        "text-align": [/^(left|right|center|justify)$/],
        width: [/^\d+(\.\d+)?(px|%|rem)$/],
        "max-width": [/^\d+(\.\d+)?(px|%|rem)$/],
        "flex-basis": [/^\d+(\.\d+)?%$/],
      },
    },
    transformTags: {
      h1: "h2",
      a: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          ...(attribs.target === "_blank"
            ? { rel: "noopener noreferrer" }
            : {}),
        },
      }),
      iframe: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          loading: "lazy",
          referrerpolicy: "strict-origin-when-cross-origin",
        },
      }),
    },
  });
}

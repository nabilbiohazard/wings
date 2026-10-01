import { useId, type ReactNode } from "react";

export type CharmMotif =
  | "shell"
  | "starfish"
  | "pearl"
  | "fish"
  | "wave"
  | "sun"
  | "flower"
  | "leaf"
  | "butterfly"
  | "clover"
  | "moon"
  | "star"
  | "planet"
  | "heart"
  | "bow"
  | "lock"
  | "cherry"
  | "strawberry"
  | "lemon"
  | "orange";

type CharmArtProps = {
  motif: CharmMotif;
  color: string;
  className?: string;
};

// Enamel-style illustrations for campaign previews, not product photographs.
export function CharmArt({ motif, color, className }: CharmArtProps) {
  const id = useId().replace(/:/g, "");
  const gold = `url(#gold-${id})`;
  let shape: ReactNode;

  switch (motif) {
    case "shell":
      shape = (
        <>
          <path d="M31 80C27 63 12 58 15 43c2-9 10-13 17-11 3-14 15-17 24-9 11-7 23 0 22 11 16 1 20 18 9 29L68 80Z" />
          <path
            d="M35 75 27 42m16 32-3-43m11 43 6-43m2 44 15-33m-8 35 14-19"
            fill="none"
            opacity=".55"
          />
          <path d="M32 80h35l-6 9H39Z" fill="#fff7e0" />
        </>
      );
      break;
    case "starfish":
      shape = (
        <>
          <path d="m50 20 11 24 27-5-18 23 8 27-28-14-27 14 8-27-18-23 27 5Z" />
          <path
            d="m50 32 1 30m-25-13 25 13 23-13M33 77l18-15 16 15"
            stroke="#fff6df"
            strokeDasharray="1 6"
            strokeWidth="3"
            fill="none"
          />
        </>
      );
      break;
    case "pearl":
      shape = (
        <>
          <circle cx="50" cy="57" r="29" fill={`url(#pearl-${id})`} />
          <path
            d="M31 51a20 20 0 0 1 17-16"
            stroke="white"
            strokeWidth="5"
            fill="none"
            opacity=".85"
          />
          <circle cx="55" cy="80" r="2" fill="#d8c1ac" stroke="none" />
        </>
      );
      break;
    case "fish":
      shape = (
        <>
          <path d="M69 42 88 29v50L69 66C47 93 19 72 14 55c9-19 35-34 55-13Z" />
          <path d="M37 33c9 12 9 32 0 44M52 47l9 9-9 9" fill="none" />
          <circle cx="27" cy="52" r="3" fill="#243f49" stroke="none" />
        </>
      );
      break;
    case "wave":
      shape = (
        <>
          <circle cx="50" cy="55" r="33" fill="#d6eeef" />
          <path d="M18 62c15 6 21-6 26-22 5-16 27-18 32-1-12-5-20 5-15 14 4 8 13 10 21 7-4 32-57 35-64 2Z" />
          <path
            d="M25 66c12 9 25 5 32-3"
            fill="none"
            stroke="#fff8de"
            strokeWidth="4"
          />
        </>
      );
      break;
    case "sun":
      shape = (
        <>
          <path d="m50 17 7 13 14-5 1 16 15 5-10 12 6 14-16 2-6 15-12-10-14 7-3-16-16-5 10-12-7-14 16-2Z" />
          <circle cx="50" cy="55" r="20" fill="#f9d364" />
          <path d="M41 57q9 10 18 0" fill="none" />
          <path d="M41 48h1m16 0h1" strokeWidth="3" />
        </>
      );
      break;
    case "flower":
      shape = (
        <>
          <path d="M50 41C29 12 15 36 31 51 6 57 23 81 41 67c-2 28 27 28 22 0 23 13 36-13 11-18 15-23-13-38-24-8Z" />
          <circle cx="52" cy="54" r="12" fill="#f5d878" />
          <circle cx="48" cy="50" r="3" fill="#fff8d2" stroke="none" />
        </>
      );
      break;
    case "leaf":
      shape = (
        <>
          <path d="M22 84C9 40 45 25 80 24c2 35-7 68-58 60Z" />
          <path
            d="m23 84 44-46M34 73l-5-23m17 11 22 1M46 60l-2-21"
            fill="none"
            stroke="#e3ebba"
          />
        </>
      );
      break;
    case "butterfly":
      shape = (
        <>
          <path d="M49 51C29 12 7 24 17 52l20 9c-31 4-18 35 6 17l7-16 8 16c25 18 36-13 7-17l19-9c11-28-13-40-34-1Z" />
          <path d="M50 44v29m0-29-9-13m9 13 10-13" fill="none" />
          <path d="m25 39 14 12m37-12L62 51" stroke="#fff6eb" strokeWidth="4" />
        </>
      );
      break;
    case "clover":
      shape = (
        <>
          <path d="M49 55C16 54 19 21 34 26c-2-21 32-15 19 12C72 9 96 28 78 40c22 6 8 35-18 20C85 80 59 100 50 79 37 98 17 75 49 55Z" />
          <path d="m51 53-7 39" fill="none" strokeWidth="4" />
        </>
      );
      break;
    case "moon":
      shape = (
        <>
          <path d="M66 22C40 21 15 44 24 67c12 32 49 27 62 5C47 84 35 44 66 22Z" />
          <path d="m72 26 3 8 9 3-9 3-3 9-3-9-8-3 8-3Z" fill="#f5dc8b" />
        </>
      );
      break;
    case "star":
      shape = (
        <>
          <path d="m50 20 11 23 27 4-19 20 5 27-24-13-24 13 5-27-19-20 27-4Z" />
          <path
            d="m50 33 7 16 18 3"
            fill="none"
            stroke="#fff7d7"
            strokeWidth="3"
          />
        </>
      );
      break;
    case "planet":
      shape = (
        <>
          <circle cx="51" cy="55" r="26" />
          <path
            d="M30 42c13 0 24 7 34 20m-28 5 15 7"
            stroke="#fff3cb"
            fill="none"
            opacity=".6"
          />
          <ellipse
            cx="50"
            cy="57"
            rx="43"
            ry="12"
            transform="rotate(-28 50 57)"
            fill="none"
            strokeWidth="7"
          />
          <path d="m75 25 4-7m5 16 7-2" fill="none" />
        </>
      );
      break;
    case "heart":
      shape = (
        <>
          <path d="M50 88 18 56C-1 31 30 13 50 37c20-24 51-6 32 19Z" />
          <path
            d="M22 43c0-9 9-12 16-7"
            fill="none"
            stroke="#fff3f1"
            strokeWidth="4"
          />
        </>
      );
      break;
    case "bow":
      shape = (
        <>
          <path d="m43 48-24-19c-10 11-10 24-3 38l27-11-15 29 17-4 7-23 8 24 17 5-16-31 25 11c7-14 7-26-3-38L57 48Z" />
          <rect x="42" y="43" width="16" height="19" rx="6" fill="#fff0ec" />
        </>
      );
      break;
    case "lock":
      shape = (
        <>
          <path d="M32 44V32c0-25 36-25 36 0v12" fill="none" strokeWidth="7" />
          <rect x="24" y="41" width="52" height="45" rx="12" />
          <path d="M50 57c-10-8-16 4 0 15 16-11 10-23 0-15Z" fill="#fff2df" />
        </>
      );
      break;
    case "cherry":
      shape = (
        <>
          <path
            d="M48 25c1 18-7 31-17 39m17-39c16 17 21 30 22 42"
            stroke="#698c4e"
            fill="none"
            strokeWidth="4"
          />
          <path d="M49 27c6-17 24-17 33-12-7 15-19 18-33 12Z" fill="#8cb369" />
          <circle cx="30" cy="70" r="18" />
          <circle cx="69" cy="73" r="18" />
          <path
            d="M20 66q1-7 8-8m31 12q1-7 8-8"
            stroke="#fff1e8"
            fill="none"
            strokeWidth="3"
          />
        </>
      );
      break;
    case "strawberry":
      shape = (
        <>
          <path d="M18 43c3-22 61-22 65 0 4 16-20 46-33 46S13 59 18 43Z" />
          <path
            d="m27 31 11-15 12 13 12-13 11 15-14 8-9-6-10 7Z"
            fill="#8cb369"
          />
          <path
            d="m32 47 2 4m15-7 1 4m18-1-2 4M40 63l1 4m17-4-1 4m-7 9v3"
            stroke="#fff2c2"
            strokeWidth="3"
          />
        </>
      );
      break;
    case "lemon":
      shape = (
        <>
          <path d="M24 72C3 56 34 20 52 26l10-6 4 11c25 12 10 52-14 52l-11 6-5-10Z" />
          <path
            d="M30 61c-6-10 5-21 13-24"
            fill="none"
            stroke="#fff8cd"
            strokeWidth="4"
          />
          <path d="M61 26c1-15 16-17 25-11-2 12-14 17-25 11Z" fill="#8cb369" />
        </>
      );
      break;
    case "orange":
      shape = (
        <>
          <circle cx="50" cy="58" r="31" />
          <circle
            cx="50"
            cy="58"
            r="24"
            fill="#ffb44d"
            stroke="#fff0cb"
            strokeWidth="3"
          />
          <path
            d="M50 34v48M26 58h48M33 41l34 34m0-34L33 75"
            stroke="#fff0cb"
          />
          <path d="M50 26c0-14 17-18 26-12-3 13-17 18-26 12Z" fill="#8cb369" />
        </>
      );
      break;
  }

  return (
    <svg
      viewBox="0 0 100 112"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id={`gold-${id}`}
          x1="15"
          y1="15"
          x2="85"
          y2="100"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#b38b42" />
          <stop offset=".35" stopColor="#f7dfa0" />
          <stop offset=".65" stopColor="#b58b41" />
          <stop offset="1" stopColor="#e1be75" />
        </linearGradient>
        <radialGradient id={`pearl-${id}`} cx=".35" cy=".3" r=".7">
          <stop stopColor="#fffefa" />
          <stop offset=".6" stopColor="#f4e9e2" />
          <stop offset="1" stopColor="#cdbcb9" />
        </radialGradient>
      </defs>
      <ellipse cx="50" cy="12" rx="7" ry="9" stroke={gold} strokeWidth="3.5" />
      <g
        transform="translate(0 8)"
        fill={color}
        stroke={gold}
        strokeWidth="2.3"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {shape}
      </g>
    </svg>
  );
}

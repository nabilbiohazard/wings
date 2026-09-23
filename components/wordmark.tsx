import Link from "next/link";

export function Wordmark() {
  return (
    <Link
      href="/"
      aria-label="Wings Gallery"
      className="flex flex-col items-center text-inherit transition-transform duration-500 hover:scale-[1.02]"
    >
      <span className="font-serif text-3xl leading-none tracking-[8px]">
        WINGS
      </span>

      <span className="mt-1 text-[9px] tracking-[5px]">
        GALLERY
      </span>
    </Link>
  );
}
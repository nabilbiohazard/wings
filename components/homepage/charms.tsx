"use client";

import {
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import Link from "next/link";
import { Icon } from "../icon";
import { persianNumber } from "@/lib/products";
import { CharmArt, type CharmMotif } from "./charm-art";
import styles from "./charms.module.css";

type Charm = { name: string; motif: CharmMotif; color: string };
type Campaign = {
  id: string;
  name: string;
  english: string;
  title: string;
  description: string;
  color: string;
  ink: string;
  charms: Charm[];
};

const campaigns: Campaign[] = [
  {
    id: "sea",
    name: "کنار دریا",
    english: "SUN & SEA",
    color: "#b9dfe8",
    ink: "#234d60",
    title: "یک تکه از تابستان، همیشه همراهت.",
    description:
      "صدف‌های ساحلی، آبیِ موج‌ها و مرواریدهای کوچک؛ یادگاری از روزهای آفتابی کنار دریا.",
    charms: [
      { name: "صدف ساحلی", motif: "shell", color: "#e9b8a2" },
      { name: "ستاره دریایی", motif: "starfish", color: "#e2a277" },
      { name: "مروارید", motif: "pearl", color: "#fff5e9" },
      { name: "ماهی فیروزه‌ای", motif: "fish", color: "#6eafb6" },
      { name: "موج آبی", motif: "wave", color: "#559fae" },
      { name: "آفتاب طلایی", motif: "sun", color: "#ebbf55" },
    ],
  },
  {
    id: "garden",
    name: "طبیعت",
    english: "SECRET GARDEN",
    color: "#c4d5b6",
    ink: "#344d35",
    title: "بهار را به روزهایت گره بزن.",
    description:
      "برگ‌های سبز، گل‌های لطیف و پروانه‌ها؛ یک باغ کوچک که هر جا بروی با تو شکوفه می‌دهد.",
    charms: [
      { name: "گل مینا", motif: "flower", color: "#fff4df" },
      { name: "برگ زیتون", motif: "leaf", color: "#91ad69" },
      { name: "پروانه یاسی", motif: "butterfly", color: "#c6b3d4" },
      { name: "شبدر خوش‌شانس", motif: "clover", color: "#6a9259" },
      { name: "شکوفه صورتی", motif: "flower", color: "#efb5c3" },
      { name: "پروانه سبز", motif: "butterfly", color: "#b9cf9a" },
    ],
  },
  {
    id: "love",
    name: "love",
    english: "LOVE NOTES",
    color: "#f3c1d5",
    ink: "#71334e",
    title: "حرف‌هایی که با یک چارم می‌گویی.",
    description:
      "قلب‌های کوچک، پاپیون‌های صورتی و یک قفل طلایی؛ جزئیاتی برای عزیزترین آدمِ قصه‌ات.",
    charms: [
      { name: "قلب صورتی", motif: "heart", color: "#e994ae" },
      { name: "پاپیون", motif: "bow", color: "#e7a5b7" },
      { name: "قفل عشق", motif: "lock", color: "#e8c77c" },
      { name: "قلب گیلاسی", motif: "heart", color: "#c95768" },
      { name: "گل رز", motif: "flower", color: "#da8e9e" },
      { name: "مروارید عشق", motif: "pearl", color: "#fff4ed" },
    ],
  },
  {
    id: "night",
    name: "night",
    english: "AFTER MIDNIGHT",
    color: "#343653",
    ink: "#f1e6cf",
    title: "برای رویاهایی که بیدار می‌مانند.",
    description:
      "ماه طلایی، ستاره‌های دور و سیاره‌های خیال؛ کمی از جادوی آسمان شب، نزدیک تو.",
    charms: [
      { name: "ماه طلایی", motif: "moon", color: "#e8cc83" },
      { name: "ستاره شب", motif: "star", color: "#d6c094" },
      { name: "زحل یاسی", motif: "planet", color: "#b5a0c6" },
      { name: "ستاره آبی", motif: "star", color: "#91a6c6" },
      { name: "ماه نقره‌ای", motif: "moon", color: "#d4d6e2" },
      { name: "سیاره رویا", motif: "planet", color: "#8da9b1" },
    ],
  },
  {
    id: "fruit",
    name: "طعم شادی",
    english: "FRUIT CLUB",
    color: "#f6c5a6",
    ink: "#703d2d",
    title: " یک دنیا رنگ.",
    description:
      "گیلاس‌های قرمز، توت‌فرنگی‌های شیرین و لیموهای آفتابی؛ برای روزهایی که دلت رنگ می‌خواهد.",
    charms: [
      { name: "گیلاس دوتایی", motif: "cherry", color: "#d94d53" },
      { name: "توت‌فرنگی", motif: "strawberry", color: "#e66a6c" },
      { name: "لیموی آفتابی", motif: "lemon", color: "#f0d86f" },
      { name: "پرتقال", motif: "orange", color: "#f1a45b" },
      { name: "گیلاس صورتی", motif: "cherry", color: "#e995ac" },
      { name: "توت‌فرنگی خامه‌ای", motif: "strawberry", color: "#efb4ae" },
    ],
  },
];

export function Charms() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCharm, setSelectedCharm] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const campaign = campaigns[activeIndex];
  const featured = campaign.charms[selectedCharm];

  function activate(index: number) {
    setActiveIndex(index);
    setSelectedCharm(0);
  }

  function navigateTabs(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    let next = index;
    if (event.key === "ArrowDown") next = (index + 1) % campaigns.length;
    else if (event.key === "ArrowUp")
      next = (index - 1 + campaigns.length) % campaigns.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = campaigns.length - 1;
    else return;
    event.preventDefault();
    activate(next);
    tabs.current[next]?.focus();
  }

  return (
    <section
      id="charms"
      dir="rtl"
      aria-labelledby="charms-heading"
      className="scroll-mt-28 bg-[#fbf9f6] py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-[1600px] px-4 sm:px-8">
        <div className="mb-8 flex items-end justify-between gap-6 sm:mb-10">
          <div>
            <p
              className="mb-3 text-[10px] tracking-[3px] text-black/45"
              lang="en"
              dir="ltr"
            >
              SMALL CHARMS, BIG FEELINGS
            </p>
            <h2
              id="charms-heading"
              className="text-3xl font-medium text-[#201d1e] sm:text-4xl lg:text-5xl"
            >
              چارم‌ها؛ تکه‌های دنیای تو
            </h2>
            <p className="mt-4 text-sm leading-7 text-black/55">
              پنج حال‌وهوا، کلی داستان کوچک. دنیای خودت را پیدا کن.
            </p>
          </div>
          <span
            aria-hidden="true"
            className="hidden font-['Cormorant_Garamond'] text-6xl italic text-[#b8a69e] lg:block"
          >
            Charms
          </span>
        </div>

        <div className={styles.explorer}>
          <div
            role="tablist"
            aria-label="کالکشن‌های چارم"
            aria-orientation="vertical"
            className={styles.tabs}
          >
            {campaigns.map((item, index) => (
              <button
                key={item.id}
                id={`charm-tab-${item.id}`}
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                aria-controls={`charm-panel-${item.id}`}
                tabIndex={index === activeIndex ? 0 : -1}
                ref={(element) => {
                  tabs.current[index] = element;
                }}
                onClick={() => activate(index)}
                onKeyDown={(event) => navigateTabs(event, index)}
                className={styles.tab}
                style={
                  {
                    "--tab-color": item.color,
                    "--tab-ink": item.ink,
                  } as CSSProperties
                }
              >
                <span aria-hidden="true" className={styles.tabNumber}>
                  {persianNumber(index + 1).padStart(2, "۰")}
                </span>
                <span className={styles.tabLabel}>
                  <span>{item.name}</span>
                  <span lang="en" dir="ltr" className={styles.tabEnglish}>
                    {item.english}
                  </span>
                </span>
                <span aria-hidden="true" className={styles.tabArrow}>
                  <Icon name="arrow" size={17} />
                </span>
              </button>
            ))}
          </div>

          {campaigns.map((item, index) => (
            <div
              key={item.id}
              id={`charm-panel-${item.id}`}
              role="tabpanel"
              aria-labelledby={`charm-tab-${item.id}`}
              hidden={index !== activeIndex}
              tabIndex={0}
              className={styles.panel}
              style={
                {
                  "--campaign-color": item.color,
                  "--campaign-ink": item.ink,
                } as CSSProperties
              }
            >
              {index === activeIndex && (
                <>
                  <div className={styles.panelTop}>
                    <span lang="en" dir="ltr">
                      {campaign.english}
                    </span>
                    <span>
                      {persianNumber(activeIndex + 1).padStart(2, "۰")} / ۰۵
                    </span>
                  </div>
                  <div className={styles.intro}>
                    <h3>{campaign.title}</h3>
                    <p>{campaign.description}</p>
                  </div>
                  <div className={styles.content}>
                    <div
                      className={styles.charmsGrid}
                      role="group"
                      aria-label={`پیش‌نمایش چارم‌های ${campaign.name}`}
                    >
                      {campaign.charms.map((charm, charmIndex) => (
                        <button
                          key={`${campaign.id}-${charm.name}`}
                          type="button"
                          aria-pressed={selectedCharm === charmIndex}
                          aria-label={`پیش‌نمایش ${charm.name}`}
                          onClick={() => setSelectedCharm(charmIndex)}
                          className={styles.charmCard}
                        >
                          <div className={styles.charmImage}>
                            <CharmArt
                              motif={charm.motif}
                              color={charm.color}
                              className={styles.smallArt}
                            />
                            <span className={styles.selectionIcon}>
                              <Icon
                                name={
                                  selectedCharm === charmIndex
                                    ? "check"
                                    : "plus"
                                }
                                size={12}
                              />
                            </span>
                          </div>
                          <span className={styles.charmName}>{charm.name}</span>
                        </button>
                      ))}
                    </div>
                    <div className={styles.featured} aria-hidden="true">
                      <div className={styles.featuredHalo}>
                        <CharmArt
                          motif={featured.motif}
                          color={featured.color}
                          className={styles.largeArt}
                        />
                      </div>
                      <span className={styles.featuredName}>
                        {featured.name}
                      </span>
                      <span className={styles.featuredCaption}>
                        a little piece of you
                      </span>
                    </div>
                  </div>
                  <div className={styles.panelFooter}>
                    <p role="status">پیش‌نمایش طرح: {featured.name}</p>
                    <Link
                      href="/custom-design#builder"
                      className={styles.designLink}
                    >
                      شروع طراحی <Icon name="arrow" size={16} />
                    </Link>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

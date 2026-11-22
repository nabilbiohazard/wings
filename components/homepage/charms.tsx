"use client";

import {
  useEffect,
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
  video: string;
  title: string;
  description: string;
  color: string;
  ink: string;
  cardColor?: string;
  charms: Charm[];
};

const campaigns: Campaign[] = [
  {
    id: "sea",
    video: "sea.mp4",
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
      { name: "صدف مرواریدی", motif: "shell", color: "#f5dfd1" },
      { name: "ستاره مرجانی", motif: "starfish", color: "#ed998a" },
      { name: "ماهی آبی", motif: "fish", color: "#82b9dc" },
      { name: "مروارید صورتی", motif: "pearl", color: "#f3d3d9" },
    ],
  },
  {
    id: "garden",
    video: "nature.mp4",
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
      { name: "گل آفتابی", motif: "flower", color: "#edcb70" },
      { name: "برگ بهاری", motif: "leaf", color: "#b7ca85" },
      { name: "پروانه آبی", motif: "butterfly", color: "#9fc9de" },
      { name: "شبدر طلایی", motif: "clover", color: "#d6bf78" },
    ],
  },
  {
    id: "love",
    video: "love.mp4",
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
      { name: "قلب یاسی", motif: "heart", color: "#c4a2ce" },
      { name: "پاپیون طلایی", motif: "bow", color: "#dfbf76" },
      { name: "قفل نقره‌ای", motif: "lock", color: "#cdd0d8" },
      { name: "گل عشق", motif: "flower", color: "#efbacb" },
    ],
  },
  {
    id: "night",
    video: "night.mp4",
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
      { name: "ستاره طلایی", motif: "star", color: "#efcf78" },
      { name: "ماه یاسی", motif: "moon", color: "#c5afd8" },
      { name: "سیاره آبی", motif: "planet", color: "#809fc5" },
      { name: "ستاره نقره‌ای", motif: "star", color: "#dedfe8" },
    ],
  },
  {
    id: "fruit",
    video: "art.mp4",
    name: "هنر و موسیقی",
    english: "ART & MUSIC",
    color: "#d9caed",
    ink: "#43295e",
    cardColor: "#f0e7fa",
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
      { name: "لیموی سبز", motif: "lemon", color: "#b8ce72" },
      { name: "پرتقال طلایی", motif: "orange", color: "#eeb85d" },
      { name: "گیلاس سرخ", motif: "cherry", color: "#bd4858" },
      { name: "توت‌فرنگی صورتی", motif: "strawberry", color: "#ed9fb3" },
    ],
  },
];

export function Charms() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCharm, setSelectedCharm] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const campaign = campaigns[activeIndex];
  const featured = campaign.charms[selectedCharm];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || !motion.matches) {
        video.pause();
        return;
      }
      if (!video.hasAttribute("src")) video.src = `/videos/campaigns/${campaign.video}`;
      void video.play().catch(() => {});
    });

    const updatePlayback = () => {
      observer.disconnect();
      if (motion.matches) observer.observe(video);
      else video.pause();
    };

    updatePlayback();
    motion.addEventListener("change", updatePlayback);
    return () => {
      observer.disconnect();
      video.pause();
      motion.removeEventListener("change", updatePlayback);
    };
  }, [campaign.video]);

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
      className="scroll-mt-28 pt-16 sm:pt-20 lg:pt-24"
      style={{
        background: "linear-gradient(to bottom, #fff8fb 0%, #fff8fb 50%, #140d12 50%, #140d12 100%)",
      }}
    >
      <div className="w-full">
        <div className={`site-container ${styles.sectionHeading}`}>
            <p className={styles.headingEyebrow} lang="en" dir="ltr">
              Five themes. <span>Endless stories.</span>
            </p>
            <h2
              id="charms-heading"
              className={`font-serif ${styles.headingTitle}`}
              lang="en"
              dir="ltr"
            >
              Find your <em>charms.</em>
            </h2>
            <div className={styles.themePalette} aria-hidden="true">
              {campaigns.map((theme) => (
                <span key={theme.id} style={{ backgroundColor: theme.color }} />
              ))}
            </div>
            <p className={styles.headingDescription}>
              پنج کالکشن با حال‌وهوای متفاوت؛ چارم‌های دلخواهت را پیدا کن و قصه‌ی خودت را بساز.
            </p>
        </div>

        <div className="relative isolate overflow-hidden rounded-[28px] p-[2px]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-[150%] animate-[spin_5s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_80deg,#f9a8d4_140deg,#f472b6_180deg,#f9a8d4_220deg,transparent_300deg)] motion-reduce:animate-none"
          />
        <div
          className={styles.explorer}
          style={{ backgroundColor: campaign.color }}
        >
          <video
            ref={videoRef}
            key={campaign.video}
            className={styles.campaignVideo}
            aria-hidden="true"
            loop
            muted
            playsInline
            preload="none"
          />
          <div className={styles.campaignNavigation}>
            <button
              type="button"
              className={styles.campaignArrow}
              aria-label="کمپین قبلی"
              onClick={() => activate((activeIndex - 1 + campaigns.length) % campaigns.length)}
            >
              <Icon name="arrow" size={20} style={{ transform: "rotate(90deg)" }} />
            </button>
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
            <button
              type="button"
              className={styles.campaignArrow}
              aria-label="کمپین بعدی"
              onClick={() => activate((activeIndex + 1) % campaigns.length)}
            >
              <Icon name="arrow" size={20} style={{ transform: "rotate(-90deg)" }} />
            </button>
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
                  "--campaign-ink": item.ink,
                  "--charm-card-color": item.cardColor,
                  "--charm-card-ink": item.cardColor ? item.ink : undefined,
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
      </div>
    </section>
  );
}

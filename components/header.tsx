"use client";

import { useEffect, useState } from "react";
import { Icon } from "./icon";
import { useShop } from "./shop-provider";
import { Wordmark } from "./wordmark";


const links = [
  { name: "خانه", href: "#" },
  { name: "فروشگاه", href: "#new-arrivals" },
  { name: "خودت بساز", href: "#build-your-own" },
  { name: "کالکشن‌ها", href: "#collections" },
  { name: "درباره ما", href: "#our-story" },
  { name: "مجله وینگز", href: "#journal" },
  { name: "تماس با ما", href: "#contact" },
];



export function Header() {

  const [scrolled, setScrolled] = useState(false);


  const {
    openPanel,
    favorites,
    cart
  } = useShop();



  useEffect(() => {

    const handleScroll = () => {

      setScrolled(window.scrollY > 50);

    };


    window.addEventListener(
      "scroll",
      handleScroll
    );


    return () => {

      window.removeEventListener(
        "scroll",
        handleScroll
      );

    };


  }, []);




  return (

    <header

      className={`
        z-50
        w-full
        transition-all
        duration-500

        ${scrolled
          ?
          "fixed top-0 bg-white text-black shadow-md"
          :
          "absolute top-0 text-white"
        }

      `}

    >


      <div

        className="
          max-w-[1600px]
          mx-auto
          px-8
        "

      >


        {/* TOP ROW */}

        <div

          className="
            h-[65px]
            flex
            items-center
            justify-between
            direction-rtl
          "

        >



          {/* LOGO RIGHT */}

          <Wordmark />

          {/* search box */}
          <button
            onClick={() => openPanel("search")}
            className={`
    group
    flex items-center gap-4
    w-[340px]
    h-12
    border-b
    transition-all duration-300

    ${scrolled
                ?
                "border-black/20 text-black hover:border-black"
                :
                "border-white/40 text-white hover:border-white"
              }

  `}
            aria-label="باز کردن جستجو"
          >

            <Icon
              name="search"
              className={`
      w-5 h-5
      transition-transform
      duration-300
      group-hover:scale-110

      ${scrolled
                  ?
                  "text-black"
                  :
                  "text-white"
                }

    `}
            />


            <span

              className={`
      flex-1
      text-right
      text-sm
      tracking-wide
      transition-colors

      ${scrolled
                  ?
                  "text-black hover:text-black"
                  :
                  "text-white hover:text-white"
                }

    `}

            >

              جستجو در محصولات...

            </span>


          </button>




          {/* ACTIONS LEFT */}

          <div

            className="
              flex
              items-center
              gap-5
              direction-ltr
            "

          >








            <button

              onClick={() => openPanel("wishlist")}

              className="
                relative
              "

            >

              <Icon name="heart" />


              {
                favorites.length > 0 &&

                <span

                  className="
                    absolute
                    -top-2
                    -right-3
                    text-[10px]
                    bg-black
                    text-white
                    rounded-full
                    w-4
                    h-4
                    flex
                    items-center
                    justify-center
                  "

                >

                  {favorites.length}

                </span>

              }


            </button>





            <button

              onClick={() => openPanel("account")}

            >

              <Icon name="user" />

            </button>






            <button

              onClick={() => openPanel("cart")}

              className="
                relative
              "

            >

              <Icon name="bag" />


              <span

                className="
                  absolute
                  -top-2
                  -right-3
                  text-[10px]
                  bg-black
                  text-white
                  rounded-full
                  w-4
                  h-4
                  flex
                  items-center
                  justify-center
                "

              >

                {
                  cart.reduce(
                    (sum, item) =>
                      sum + item.quantity,
                    0
                  )
                }

              </span>


            </button>



          </div>


        </div>







        {/* MAIN MENU */}


        <nav

          className="
            hidden
            md:flex
            h-[55px]
            items-center
            justify-between
            direction-rtl
            mx-2
          "

        >


          {
            links.map((link) => (

              <a

                key={link.name}

                href={link.href}

                className={`
        text-sm
        px-5
        py-2
        rounded-full
        whitespace-nowrap
        transition-all
        duration-300

        ${scrolled
                    ?
                    `
          text-black
          hover:bg-black
          hover:text-white
          `
                    :
                    `
          text-white
          hover:bg-white
          hover:text-black
          `
                  }

      `}

              >

                {link.name}

              </a>


            ))
          }



        </nav>



      </div>


    </header>


  );

}
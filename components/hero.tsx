import { Icon } from "./icon";
import { Reveal } from "./reveal";


export function Hero() {

  return (

    <section
      className="
        relative
        h-screen
        min-h-[750px]
        overflow-hidden
        text-white
      "
    >


      {/* VIDEO BACKGROUND */}

      <div
        className="
          absolute
          inset-0
        "
      >

        <video

          autoPlay
          loop
          muted
          playsInline

          className="
            w-full
            h-full
            object-cover
          "

        >

          <source
            src="/videos/videoplayback.mp4"
            type="video/mp4"
          />

        </video>


      </div>




      {/* PREMIUM OVERLAY */}

      <div
        className="
          absolute
          inset-0
          bg-gradient-to-l
          from-black/70
          via-black/40
          to-black/20
        "
      />



      {/* CONTENT */}

      <div

        className="
          relative
          z-10
          h-full
          flex
          items-center
        "

      >


        <Reveal

          className="
            w-full
            max-w-[1600px]
            mx-auto
            px-8
          "

        >


          <div

            className="
    max-w-xl
    ml-auto
    text-right
  "

          >




            <p

              className="
                text-sm
                tracking-widest
                text-pink-200
                mb-8
              "

            >

              بیشتر از یک اکسسوری

            </p>





            <h1

              className="
                font-serif
                text-7xl
                leading-[1.15]
                font-medium
                drop-shadow-lg
              "

            >

              Your style,

              <br />

              <span
                className="
                  text-pink-300
                "
              >

                Your choice

              </span>


            </h1>





            <p

              className="
                mt-7
                text-2xl
                font-serif
                text-white/90
              "

            >

              Small charms.
              <br />

              <span className="italic">

                Brighter days.

              </span>


            </p>





            <p

              className="
                mt-7
                text-gray-200
                leading-9
                text-sm
              "

            >

              برای هر حالِ تو
              <br />

              هر روز، یک انتخاب تازه
              <br />

              اکسسوری برای سبک خودت

            </p>







            {/* BUTTONS */}

            <div

              className="
                mt-10
                flex
                items-center
                justify-end
                gap-6
              "

            >




              <a

                href="#new-arrivals"

                className="
                  group
                  bg-pink-500
                  hover:bg-white
                  hover:text-black
                  transition-all
                  duration-300
                  rounded-full
                  px-9
                  py-4
                  flex
                  items-center
                  gap-4
                  text-sm
                "

              >

                کشف تازه‌رسیده‌ها


                <Icon

                  name="arrow"

                  size={18}

                />


              </a>







              <a

                href="#our-story"

                className="
                  flex
                  items-center
                  gap-3
                  text-sm
                  hover:opacity-70
                  transition
                "

              >


                <span

                  className="
                    border
                    border-white/60
                    rounded-full
                    w-12
                    h-12
                    flex
                    items-center
                    justify-center
                    backdrop-blur-sm
                  "

                >

                  ▷

                </span>


                داستان وینگز



              </a>




            </div>





          </div>



        </Reveal>


      </div>





      {/* COLLECTION LABEL */}

      <div

        className="
          absolute
          bottom-8
          right-10
          z-10
          text-xs
          tracking-[3px]
          text-white/70
        "

      >

        THE LITTLE JOYS COLLECTION — 2026


      </div>



    </section>

  )

}
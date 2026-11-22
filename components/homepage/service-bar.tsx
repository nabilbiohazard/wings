import { Icon, type IconName } from "../icon";

const services: {
  icon: IconName;
  title: string;
  description: string;
}[] = [
  {
    icon: "truck",
    title: "مهمان ما، تا درِ خانه",
    description: "ارسال رایگان خریدهای بالای یک میلیون تومان",
  },
  {
    icon: "gift",
    title: "با عشق بسته‌بندی می‌شود",
    description: "یک هدیه زیبا، حتی وقتی برای خودت است",
  },
  {
    icon: "return",
    title: "با خیال راحت انتخاب کن",
    description: "۷ روز فرصت بازگشت کالا",
  },
];

export function ServiceBar() {
  return (
    <section dir="rtl" className="w-full py-12 sm:py-16 lg:py-20" aria-label="خدمات وینگز">
      <div className="mx-auto grid w-full site-container grid-cols-1 gap-6 md:grid-cols-3">
        {services.map((service) => (
          <div key={service.icon} className="flex items-center gap-4 text-right md:justify-end md:gap-5">
            <div className="min-w-0">
              <h3 className="text-base font-medium sm:text-lg">{service.title}</h3>

              <p className="mt-1 text-sm leading-7 text-black/60 md:mt-2">{service.description}</p>
            </div>

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-black/[0.04] max-md:order-first">
              <Icon name={service.icon} size={33} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

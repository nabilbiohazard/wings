import { Icon, type IconName } from "./icon";
const services: { icon: IconName; title: string; description: string }[] = [{ icon: "truck", title: "مهمان ما، تا درِ خانه", description: "ارسال رایگان خریدهای بالای یک میلیون تومان" }, { icon: "gift", title: "با عشق بسته‌بندی می‌شود", description: "یک هدیه زیبا، حتی وقتی برای خودت است" }, { icon: "return", title: "با خیال راحت انتخاب کن", description: "۷ روز فرصت بازگشت کالا" }];
export function ServiceBar() {
  return <section className="service-bar" aria-label="خدمات وینگز"><div className="section-container grid gap-8 md:grid-cols-3">{services.map(service => <div className="service-item" key={service.icon}><Icon name={service.icon} size={33} /><div><h3>{service.title}</h3><p>{service.description}</p></div></div>)}</div></section>;
}

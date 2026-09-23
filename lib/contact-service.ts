import { wpFetch } from "./wordpress";

export type ContactMessage = {
  name:string;
  phone:string;
  email?:string;
  message:string;
};

export async function sendContactMessage(data: ContactMessage) {
  return wpFetch("/wp/v2/contact_message", {
    method: "POST",
    body: JSON.stringify(data),
  } as any);
}

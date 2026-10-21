export const PRESS_WHATSAPP = "254742767609";
export function whatsappLink(message: string) {
  return `https://wa.me/${PRESS_WHATSAPP}?text=${encodeURIComponent(message)}`;
}
export interface ContentEntry {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price?: number;
  role?: string;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-NG").format(num);
}

export function formatMileage(mileage: number): string {
  if (mileage >= 1000) {
    return `${(mileage / 1000).toFixed(1)}k km`;
  }
  return `${mileage} km`;
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function generateWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, "");
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

export function generateCallLink(phone: string): string {
  return `tel:${phone.replace(/\D/g, "")}`;
}

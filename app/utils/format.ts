export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatCompactPrice(price: number): string {
  if (price >= 1_000_000_000) {
    const val = price / 1_000_000_000;
    return `₦${val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)}B`;
  }
  if (price >= 1_000_000) {
    const val = price / 1_000_000;
    return `₦${val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)}M`;
  }
  if (price >= 1_000) {
    return `₦${Math.round(price / 1_000)}K`;
  }
  return formatPrice(price);
}

export function formatConditionLabel(condition?: string): string {
  switch (condition) {
    case "new":
      return "Brand New";
    case "foreign-used":
      return "Foreign Used";
    case "nigerian-used":
      return "Nigerian Used";
    case "certified":
      return "Certified";
    case "used":
      return "Pre-Owned";
    default:
      return condition || "Pre-Owned";
  }
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-NG").format(num);
}

export function formatMileage(mileage: number): string {
  if (mileage === 0) return "0 km";
  if (mileage >= 1000) {
    const k = mileage / 1000;
    return `${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}k km`;
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

const DEFAULT_AVATAR = "/images/avatar/default.png";

function getApiOrigin() {
  const raw = process.env.NEXT_PUBLIC_API_URL || "";
  const cleaned = raw.replace(/\/api\/?$/, "");
  return cleaned.replace(/\/$/, "");
}

export function resolveImageUrl(url?: string | null) {
  if (!url || !String(url).trim()) return DEFAULT_AVATAR;
  const value = String(url).trim();

  if (value.startsWith("https://res.cloudinary.com/")) return value;
  if (value.startsWith("data:image/")) return value;

  const apiOrigin = getApiOrigin();
  if (!apiOrigin) return value;

  if (value.startsWith("/uploads/")) {
    return `${apiOrigin}${value}`;
  }

  if (value.startsWith("uploads/")) {
    return `${apiOrigin}/${value}`;
  }

  if (/^https?:\/\/localhost[:/]/i.test(value) || /^https?:\/\/127\.0\.0\.1[:/]/i.test(value)) {
    try {
      const pathname = new URL(value).pathname;
      if (pathname.startsWith("/uploads/")) return `${apiOrigin}${pathname}`;
    } catch {
      return value;
    }
  }

  if (value.includes("/uploads/")) {
    const idx = value.indexOf("/uploads/");
    return `${apiOrigin}${value.slice(idx)}`;
  }

  return value;
}

export function getDefaultAvatarUrl() {
  return DEFAULT_AVATAR;
}

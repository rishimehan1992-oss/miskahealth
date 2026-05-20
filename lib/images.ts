/** Bump when product images are replaced to bust Next.js / browser cache */
export const IMAGE_VERSION = "20260520a";

export function imageUrl(path: string): string {
  if (!path) return path;
  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}v=${IMAGE_VERSION}`;
}

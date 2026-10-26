type RemoteArticleImageProps = {
  src: string;
  alt: string;
  className?: string;
};

/**
 * Article image URLs are entered by editors, so they can originate from any
 * public image host. A regular img element avoids Next's host allowlist while
 * retaining the same fill layout used by the article cards.
 */
export default function RemoteArticleImage({
  src,
  alt,
  className = "",
}: RemoteArticleImageProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      className={`absolute inset-0 h-full w-full ${className}`}
    />
  );
}

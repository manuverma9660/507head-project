import CopyArticleLinkButton from "@/components/CopyArticleLinkButton";
import SocialIcon from "@/components/SocialIcon";

type ArticleShareRowProps = {
  title: string;
  url: string;
};

export default function ArticleShareRow({ title, url }: ArticleShareRowProps) {
  const buttonClass =
    "flex h-10 w-10 items-center justify-center rounded-full border border-[#222] bg-[#F7F6EE] text-black transition duration-200 hover:-translate-y-0.5 hover:bg-[#f5f5f5]";

  return (
    <div
      className="flex flex-wrap items-center gap-2.5 border-y border-[#e5ddd3] py-6"
      aria-label="लेख साझा करें"
    >
      <span className="mr-1 text-xs font-bold text-[#888]">शेयर करें:</span>
      <a
        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} - ${url}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="व्हाट्सएप पर शेयर करें"
        className={buttonClass}
      >
        <SocialIcon name="whatsapp" className="h-5 w-5" />
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="फेसबुक पर शेयर करें"
        className={buttonClass}
      >
        <SocialIcon name="facebook" className="h-5 w-5" />
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="X पर शेयर करें"
        className={buttonClass}
      >
        <SocialIcon name="x" className="h-5 w-5" />
      </a>
      <CopyArticleLinkButton url={url} />
    </div>
  );
}

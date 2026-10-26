import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { IoLogoWhatsapp } from "react-icons/io";

type SocialIconName = "facebook" | "instagram" | "youtube" | "whatsapp" | "x";

type SocialIconProps = {
  name: SocialIconName;
  className?: string;
};

export default function SocialIcon({ name, className = "" }: SocialIconProps) {
  const iconClass = `shrink-0 ${className}`;

  switch (name) {
    case "facebook":
      return <FaFacebook aria-hidden className={`text-black ${iconClass}`} />;
    case "instagram":
      return <FaInstagram aria-hidden className={`text-black ${iconClass}`} />;
    case "youtube":
      return <FaYoutube aria-hidden className={`text-black ${iconClass}`} />;
    case "whatsapp":
      return (
        <IoLogoWhatsapp aria-hidden className={`text-black ${iconClass}`} />
      );
    case "x":
      return (
        <FaSquareXTwitter aria-hidden className={`text-black ${iconClass}`} />
      );
  }
}

type SocialIconName = "facebook" | "instagram" | "youtube" | "whatsapp" | "x";

type SocialIconProps = {
  name: SocialIconName;
  className?: string;
};

export default function SocialIcon({ name, className = "" }: SocialIconProps) {
  const common = { className, viewBox: "0 0 48 48", "aria-hidden": true };

  switch (name) {
    case "facebook":
      return <svg {...common}><rect x="2" y="2" width="44" height="44" rx="10" fill="#1877F2" /><path fill="#fff" d="M28.7 15.5h4.4V8.2c-.8-.1-3.4-.3-6.5-.3-6.4 0-10.8 3.9-10.8 11.2v6.3H8.7V33h7.1v19h8.7V33h6.8l1.1-7.6h-7.9v-5.5c0-2.2.6-3.7 4.2-3.7Z" transform="scale(.82) translate(5 4)" /></svg>;
    case "instagram":
      return <svg {...common}><defs><linearGradient id="instagram-app-icon" x1="5" y1="44" x2="43" y2="4" gradientUnits="userSpaceOnUse"><stop stopColor="#feda75" /><stop offset=".35" stopColor="#fa7e1e" /><stop offset=".62" stopColor="#d62976" /><stop offset="1" stopColor="#4f5bd5" /></linearGradient></defs><rect x="2" y="2" width="44" height="44" rx="10" fill="url(#instagram-app-icon)" /><rect x="13" y="13" width="22" height="22" rx="7" fill="none" stroke="#fff" strokeWidth="3.5" /><circle cx="24" cy="24" r="5.2" fill="none" stroke="#fff" strokeWidth="3.5" /><circle cx="31.8" cy="16.7" r="2.1" fill="#fff" /></svg>;
    case "youtube":
      return <svg {...common}><rect x="2" y="2" width="44" height="44" rx="10" fill="#ff0033" /><path fill="#fff" d="M37.5 16.1c-.3-2.3-2.2-4-4.5-4.3-2.9-.4-6-.6-9-.6s-6.1.2-9 .6c-2.3.3-4.2 2-4.5 4.3-.4 2.7-.6 5.3-.6 7.9s.2 5.2.6 7.9c.3 2.3 2.2 4 4.5 4.3 2.9.4 6 .6 9 .6s6.1-.2 9-.6c2.3-.3 4.2-2 4.5-4.3.4-2.7.6-5.3.6-7.9s-.2-5.2-.6-7.9ZM21 30.5V17.5L31.8 24 21 30.5Z" /></svg>;
    case "whatsapp":
      return <svg {...common}><rect x="2" y="2" width="44" height="44" rx="10" fill="#25D366" /><path fill="#fff" d="M24 10.5a13.4 13.4 0 0 0-11.4 20.5L11 38l7.2-1.9A13.5 13.5 0 1 0 24 10.5Zm0 23.4a9.9 9.9 0 0 1-5.1-1.4l-.4-.2-4.3 1.1 1.2-4.2-.3-.4A9.9 9.9 0 1 1 24 33.9Zm5.5-7.5c-.3-.2-1.8-.9-2.1-1s-.5-.1-.7.2l-1 1.2c-.2.2-.4.2-.7.1-1.7-.8-2.9-1.9-3.8-3.5-.2-.3 0-.5.1-.6l.5-.6c.2-.2.2-.4.3-.6 0-.2 0-.4-.1-.5l-1-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.1 1.1-1.1 2.7s1.1 3.1 1.3 3.3c.2.2 2.2 3.4 5.3 4.7.7.3 1.3.5 1.8.6.8.2 1.4.2 2 .1.6-.1 1.8-.8 2.1-1.5.3-.7.3-1.4.2-1.5-.1-.1-.3-.2-.6-.4Z" /></svg>;
    case "x":
      return <svg {...common}><rect x="2" y="2" width="44" height="44" rx="10" fill="#050505" /><path fill="#fff" d="M32.9 10h4.5L27.6 21.2 39 38H30l-7-10.7L13.6 38H9.1l10.5-12L8.7 10H18l6.3 9.8L32.9 10Zm-1.6 24.9h2.5L16.7 12.9H14L31.3 34.9Z" /></svg>;
  }
}

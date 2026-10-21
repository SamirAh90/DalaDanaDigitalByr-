import { company } from "@/content/site";

type SocialIconProps = { className?: string };

function InstagramIcon({ className }: SocialIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedinIcon({ className }: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M5.4 8.3H2.2V21h3.2V8.3ZM3.8 3A1.9 1.9 0 1 0 3.8 6.8 1.9 1.9 0 0 0 3.8 3ZM21.8 13.7c0-3.8-2-5.6-4.7-5.6-2.2 0-3.2 1.2-3.7 2V8.3h-3.2V21h3.2v-6.3c0-1.7.3-3.3 2.4-3.3 2 0 2.1 1.9 2.1 3.4V21h3.2l.7-7.3Z" />
    </svg>
  );
}

function FacebookIcon({ className }: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M13.7 21v-8h2.7l.4-3.1h-3.1V7.8c0-.9.3-1.5 1.6-1.5H17V3.5c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.2H7.5V13h2.8v8h3.4Z" />
    </svg>
  );
}

const socialPlatforms = [
  { label: "Instagram", icon: InstagramIcon },
  { label: "LinkedIn", icon: LinkedinIcon },
  { label: "Facebook", icon: FacebookIcon },
] as const;

export function SocialIcons() {
  return (
    <div className="flex items-center gap-3" aria-label="Sociala medier">
      {socialPlatforms.map(({ label, icon: Icon }) => {
        const social = company.socials.find((item) => item.label === label);

        return social ? (
          <a
            key={label}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="social-icon"
          >
            <Icon className="size-[18px]" />
          </a>
        ) : (
          <span
            key={label}
            aria-label={`${label} – länk kommer snart`}
            title={`${label} – länk kommer snart`}
            className="social-icon cursor-default opacity-55"
          >
            <Icon className="size-[18px]" />
          </span>
        );
      })}
    </div>
  );
}

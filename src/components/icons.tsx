import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Base({ size = 19, children, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

export const UserIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" />
  </Base>
);

export const CodeIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="m8 7-5 5 5 5M16 7l5 5-5 5" />
  </Base>
);

export const LayersIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="m12 3 9 5-9 5-9-5 9-5Z" />
    <path d="m3 12 9 5 9-5" />
    <path d="m3 16.5 9 5 9-5" opacity=".5" />
  </Base>
);

export const BriefcaseIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="3" y="7" width="18" height="13" rx="2.5" />
    <path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7" />
  </Base>
);

export const MailIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="3" y="5" width="18" height="14" rx="3" />
    <path d="m4 7 8 6 8-6" />
  </Base>
);

export const FileIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
    <path d="M14 3v5h5M9 13h6M9 17h4" />
  </Base>
);

export const MapPinIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </Base>
);

export const ArrowUpRightIcon = (p: IconProps) => (
  <Base strokeWidth="1.6" {...p}>
    <path d="M7 17 17 7M9 7h8v8" />
  </Base>
);

export const CloseIcon = (p: IconProps) => (
  <Base strokeWidth="1.8" {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Base>
);

export const DownloadIcon = (p: IconProps) => (
  <Base strokeWidth="1.9" {...p}>
    <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
  </Base>
);

export const SunIcon = (p: IconProps) => (
  <Base strokeWidth="1.8" {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" />
  </Base>
);

export const MoonIcon = ({ size = 18, ...p }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
  </svg>
);

export const StarIcon = ({ size = 13, ...p }: IconProps) => (
  <Base size={size} strokeWidth="1.6" {...p}>
    <path d="m12 3 2.7 5.7 6.3.8-4.6 4.3 1.2 6.2L12 17l-5.6 3 1.2-6.2L3 9.5l6.3-.8L12 3Z" />
  </Base>
);

export const PlusIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 5v14M5 12h14" />
  </Base>
);

export const TrashIcon = (p: IconProps) => (
  <Base size={16} strokeWidth="1.6" {...p}>
    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13a1.6 1.6 0 0 0 1.6 1.4h6.8A1.6 1.6 0 0 0 17 20l1-13M9 7V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v2" />
  </Base>
);

export const ChevronUpIcon = (p: IconProps) => (
  <Base size={16} {...p}>
    <path d="m6 14 6-6 6 6" />
  </Base>
);

export const ChevronDownIcon = (p: IconProps) => (
  <Base size={16} {...p}>
    <path d="m6 10 6 6 6-6" />
  </Base>
);

export const LockIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="5" y="11" width="14" height="9" rx="2.5" />
    <path d="M8 11V8a4 4 0 1 1 8 0v3" />
  </Base>
);

export const LogoutIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4M10 8l-4 4 4 4M6 12h10" />
  </Base>
);

export const RotateIcon = (p: IconProps) => (
  <Base size={16} strokeWidth="1.6" {...p}>
    <path d="M3 12a9 9 0 1 0 2.6-6.3L3 8" />
    <path d="M3 3v5h5" />
  </Base>
);

export const BoldIcon = (p: IconProps) => (
  <Base size={15} strokeWidth="2" {...p}>
    <path d="M7 4h6a3.5 3.5 0 0 1 0 7H7zM7 11h7a3.5 3.5 0 0 1 0 7H7z" />
    <path d="M7 4v14" />
  </Base>
);

export const ItalicIcon = (p: IconProps) => (
  <Base size={15} strokeWidth="1.8" {...p}>
    <path d="M10 4h8M6 20h8M14 4l-4 16" />
  </Base>
);

export const UnderlineIcon = (p: IconProps) => (
  <Base size={15} strokeWidth="1.8" {...p}>
    <path d="M7 4v7a5 5 0 0 0 10 0V4M5 21h14" />
  </Base>
);

export const LinkIcon = (p: IconProps) => (
  <Base size={15} strokeWidth="1.8" {...p}>
    <path d="M10 14a4.5 4.5 0 0 0 6.4.3l3-3a4.5 4.5 0 0 0-6.4-6.4l-1.7 1.7" />
    <path d="M14 10a4.5 4.5 0 0 0-6.4-.3l-3 3a4.5 4.5 0 0 0 6.4 6.4l1.7-1.7" />
  </Base>
);

export const ActivityIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 12h4l3-8 4 16 3-8h4" />
  </Base>
);

export const CheckIcon = (p: IconProps) => (
  <Base size={16} strokeWidth="2" {...p}>
    <path d="m4.5 12.5 5 5 10-11" />
  </Base>
);

export const GithubIcon = ({ size = 21, ...p }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49l-.01-1.7c-2.78.62-3.37-1.37-3.37-1.37-.46-1.18-1.11-1.5-1.11-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9l-.01 2.82c0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
  </svg>
);

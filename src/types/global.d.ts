declare module 'react' {
  export * from 'react';
}

declare module 'next/link' {
  import { LinkProps } from 'next/dist/client/link';
  export default function Link(props: LinkProps): JSX.Element;
}

declare module 'lucide-react' {
  import { LucideIcon } from 'lucide-react';
  export const ExternalLink: LucideIcon;
  export const Github: LucideIcon;
  export const Check: LucideIcon;
  export const Copy: LucideIcon;
  export const Circle: LucideIcon;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
} 
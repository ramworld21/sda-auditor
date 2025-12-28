declare module 'platformscode-new-react' {
  import { FC, ChangeEvent } from 'react';

  export interface DgaButtonProps {
    label?: string;
    variant?: string;
    size?: string;
    onClick?: () => void;
    trailIcon?: boolean;
    trailIconType?: string;
    trailIconProps?: any;
    className?: string;
    iconOnly?: boolean;
    iconProps?: any;
    iconType?: string;
  }

  export interface DgaTextareaProps {
    label?: string;
    value?: string;
    scrollbar?: boolean;
    resize?: boolean;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    variant?: string;
    placeholder?: string;
  }

  export interface DgaLinkProps {
    external?: boolean;
    label: string;
    size?: string;
    target?: string;
    url: string;
    variant?: string;
  }

  export interface DgaIconProps {
    icon: string;
    variant?: string;
    type?: string;
    color?: string;
    size?: string;
  }

  export interface DgaRatingProps {
    variant?: string;
    rating: number;
    readOnly?: boolean;
    onChange?: (rating: number) => void;
  }

  export interface DgaFeaturedIconProps {
    icon: {
      name: string;
      variant?: string;
      type?: string;
    };
    variant?: string;
    color?: string;
    size?: string;
  }

  export const DgaButton: FC<DgaButtonProps>;
  export const DgaTextarea: FC<DgaTextareaProps>;
  export const DgaLink: FC<DgaLinkProps>;
  export const DgaIcon: FC<DgaIconProps>;
  export const DgaRating: FC<DgaRatingProps>;
  export const DgaFeaturedIcon: FC<DgaFeaturedIconProps>;
}

declare module 'platformscode-react' {
  import { FC } from 'react';

  export interface SwitchProps {
    color?: string;
    label?: string;
    onChange?: () => void;
    onInput?: () => void;
    checked?: boolean;
    disabled?: boolean;
  }

  export const Switch: FC<SwitchProps>;
}

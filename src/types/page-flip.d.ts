declare module 'page-flip' {
  export type PageFlipSettings = {
    width: number;
    height: number;
    size?: 'fixed' | 'stretch';
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    showCover?: boolean;
    usePortrait?: boolean;
    mobileScrollSupport?: boolean;
  };

  export class PageFlip {
    constructor(element: HTMLElement, settings: PageFlipSettings);
    loadFromHTML(elements: HTMLElement[]): void;
    flipPrev(): void;
    flipNext(): void;
    getCurrentPageIndex(): number;
    on(event: 'flip', callback: () => void): void;
  }
}

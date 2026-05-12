export type Language = "tg" | "ru" | "en";

export interface NavigationCopy {
  features: string;
  howItWorks: string;
  about: string;
  restoration: string;
}

export interface Dictionary {
  languageName: string;
  nav: NavigationCopy;
  header: {
    productLabel: string;
    themeLight: string;
    themeDark: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    principles: string[];
  };
  workspace: {
    eyebrow: string;
    title: string;
    description: string;
    restoreButton: string;
    helper: string;
    noFileError: string;
  };
  upload: {
    title: string;
    description: string;
    remove: string;
    previewAlt: string;
    invalidFile: string;
  };
  controls: {
    modeLabel: string;
    modeHint: string;
    aiTitle: string;
    aiDescription: string;
    modes: {
      conservative: { label: string; description: string };
      balanced: { label: string; description: string };
      strong: { label: string; description: string };
    };
  };
  loading: {
    title: string;
    description: string;
  };
  result: {
    before: string;
    restored: string;
    recordEyebrow: string;
    recordTitle: string;
    download: string;
    provider: string;
    mode: string;
    fallback: string;
    fallbackUsed: string;
    fallbackNo: string;
    aiModel: string;
    none: string;
    providerFallback: string;
    quotaTitle: string;
    quotaMessage: string;
  };
  features: {
    eyebrow: string;
    title: string;
    description: string;
    items: Array<{ title: string; description: string }>;
  };
  howItWorks: {
    eyebrow: string;
    title: string;
    steps: Array<{ title: string; description: string }>;
  };
  about: {
    eyebrow: string;
    title: string;
    body: string;
    warning: string;
  };
  principles: {
    eyebrow: string;
    title: string;
    items: string[];
  };
  footer: {
    description: string;
    product: string;
    languageNote: string;
    copyright: string;
  };
  errors: {
    generic: string;
    backendUnavailable: string;
    invalidFile: string;
    invalidMime: string;
    fileTooLarge: string;
    corruptedImage: string;
    quotaExceeded: string;
    fallback: string;
    providerGeneric: string;
  };
}

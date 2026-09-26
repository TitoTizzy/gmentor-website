export const site = {
  name: 'Architecte Marie Gaëlle Mentor',
  domain: 'gaellementor.com',
  description: 'Portfolio architectural de Marie Gaëlle Mentor, Architectural Designer aux États-Unis et architecte licenciée en Haïti.',
  markets: {
    us: {
      code: 'us',
      label: 'USA',
      locale: 'en',
      title: 'Architectural Designer',
      email: 'US_EMAIL_TO_CONFIRM',
      hours: 'HOURS_TO_CONFIRM'
    },
    ht: {
      code: 'ht',
      label: 'Haïti',
      locale: 'fr',
      title: 'Architecte licenciée en Haïti',
      email: 'HT_EMAIL_TO_CONFIRM',
      hours: 'HORAIRES_A_CONFIRMER'
    }
  }
} as const;

export type Market = keyof typeof site.markets;
export type Locale = 'en' | 'fr' | 'kr';

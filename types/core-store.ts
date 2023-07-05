export type Priority =
  | 0.1
  | 0.2
  | 0.3
  | 0.4
  | 0.5
  | 0.6
  | 0.7
  | 0.8
  | 0.9
  | 1.0;

export type Changefreq =
  | 'always'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'never';

export type SitemapSettings = {
  hostname: string;
  includeHomepage: boolean;
  excludeDrafts: boolean;
  hostnameOverrides: {
    [key: string]: string
  };
  contentTypes: {
    [key: string]: {
      languages: {
        [key: string]: {
          pattern: string;
          priority?: Priority;
          changefreq?: Changefreq;
          includeLastmod?: boolean;
        };
      };
    };
  };
  customEntries: {
    [key: string]: {
      priority: Priority;
      changefreq: Changefreq;
    }
  }
};

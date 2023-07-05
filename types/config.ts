export type PluginConfig<Config> = {
  default: Config;
  validator: () => void;
};

export type SitemapConfig = {
  cron: string,
  limit: number,
  xsl: boolean,
  autoGenerate: boolean,
  caching: boolean,
  allowedFields: string[],
  excludedTypes: string[],
};

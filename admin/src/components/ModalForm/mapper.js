export default {
  priority: {
    label: 'Priority',
    hint: "The priority of the pages.",
    options: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
    value: 0.5,
  },
  changefreq: {
    label: 'ChangeFreq',
    hint: "The changefreq of pages.",
    options: ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'],
    value: 'monthly',
  },
};

export default {
  priority: {
    styleName: 'col-12',
    label: 'Priority',
    name: 'priority',
    type: 'select',
    description: "The priority of the pages.",
    options: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
    value: 0.5,
  },
  changefreq: {
    styleName: 'col-12',
    label: 'ChangeFreq',
    name: 'changefreq',
    type: 'select',
    description: "The changefreq of pages.",
    options: ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'],
    value: 'monthly',
  },
  area: {
    styleName: 'col-12',
    label: 'Area',
    name: 'area',
    type: 'text',
    description: "The path under which the pages are located.",
    value: "/",
    validations: {
      required: true,
      regex: /^\/[\/.a-zA-Z0-9-]*$/
    }
  },
};
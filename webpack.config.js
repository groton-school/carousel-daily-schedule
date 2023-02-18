const config = require('@battis/webpack-typescript-spa');

module.exports = config({
  root: __dirname,
  name: 'Daily Schedule',
  externals: {
    'ical.js': 'ICAL',
  },
  template: 'template',
  build: 'public'
});

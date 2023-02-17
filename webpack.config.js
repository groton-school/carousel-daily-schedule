const config = require('@battis/webpack-typescript-spa');

module.exports = config({
  root: __dirname,
  name: 'Daily Schedule',
  publicPath: '/sandbox/carousel-calendar-view',
  externals: {
    'ical.js': 'ICAL',
  },
  template: 'template',
  build: 'public'
});

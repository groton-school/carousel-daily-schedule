const config = require('@battis/webpack-typescript-spa');

module.exports = config({
  root: __dirname,
  appName: 'Groton Daily Schedule',
  externals: {
    'ical.js': 'ICAL',
  },
  template: 'template',
  build: 'public',
});

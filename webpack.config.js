module.exports = require('@battis/webpack/ts/spa')({
  root: __dirname,
  appName: 'Groton Daily Schedule',
  externals: {
    'ical.js': 'ICAL'
  },
  template: 'template',
  build: 'public'
});

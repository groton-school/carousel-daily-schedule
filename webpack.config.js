import bundle from '@battis/webpack';

export default bundle.fromTS.toSPA({
  root: import.meta.dirname,
  appName: 'Groton Daily Schedule',
  externals: {
    'ical.js': 'ICAL'
  },
  template: 'template',
  output: { path: 'public' }
});

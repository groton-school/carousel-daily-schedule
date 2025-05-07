import bundle from '@battis/webpack';

export default bundle.fromTS.toSPA({
  root: import.meta.dirname,
  appName: 'Groton Daily Schedule',
  externals: {
    'ical.js': 'ICAL',
    '@fullcalendar/core': 'FullCalendar',
    '@fullcalendar/icalendar': 'FullCalendar.ICalendar',
    '@fullcalendar/timegrid': 'FullCalendar.TimeGrid'
  },
  template: 'template',
  output: { path: 'public' }
});

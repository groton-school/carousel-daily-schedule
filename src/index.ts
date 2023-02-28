import { Calendar } from '@fullcalendar/core';
import iCalendarPlugin from '@fullcalendar/icalendar';
import timeGridPlugin from '@fullcalendar/timegrid';
import './index.scss';

const feed = new URLSearchParams(location.search).get('ics') || '';

document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');

    const calendar = new Calendar(calendarEl as HTMLElement, {
        plugins: [timeGridPlugin, iCalendarPlugin],
        initialView: 'timeGridWeek',
        titleFormat: { month: 'long', day: 'numeric' },
        headerToolbar: {
            start: 'title',
            center: '',
            end: '',
        },
        dayHeaderContent: (arg) => {
            return arg.date.toLocaleDateString([], {
                weekday: 'long',
                day: 'numeric',
            });
        },
        slotDuration: '00:30:00',
        slotMinTime: '08:00:00',
        slotMaxTime: '16:00:00',
        expandRows: true,
        aspectRatio: 16 / 8,
        events: {
            url: 'https://massive-boulder-378201.ue.r.appspot.com/feed.php?url=https://groton.myschoolapp.com/podium/feed/iCal.aspx?z=wn27FHKUwlX%2b0R6Z0JjGG1t%2bLg3lHs9J50KgJ6kRmfJntkYOCGBU5XJPQHk%2fm%2bHSdotxEnIYlSJsO1psmikQ6Q%3d%3d', //`feed.php?url=${encodeURIComponent(feed)}`,
            format: 'ics',
        },
        eventClassNames: (arg) => {
            let color = 'no-color';
            const match =
                /^(Red|Orange|Yellow|Green|Dark Blue|Light Blue|Purple)/.exec(
                    arg.event.title
                );
            if (match && match.length) {
                color = match[1].replace(' ', '-').toLowerCase();
            }
            return color;
        },
        eventContent: (arg) => {
            if (arg.event.allDay) {
                const match = /(.+) \(All\)/.exec(arg.event.title);
                if (match && match.length) {
                    switch (match[1]) {
                        case 'Monday':
                        case 'Tuesday':
                        case 'Wednesday':
                        case 'Thursday':
                        case 'Friday':
                        case 'Saturday':
                            return null;
                    }
                    return match[1];
                }
                return arg.event.title;
            }
            const match = /^([^-]+[^A])( A)? -.*/.exec(arg.event.title);
            let title = arg.event.title;
            if (match && match.length) {
                title = match[1];
                switch (title) {
                    case 'Conference period':
                        title = 'Conference';
                        break;
                    case 'Flex block':
                        title = 'Flex';
                        break;
                }
            }
            return {
                html: `${arg.event.start &&
                        arg.event.end &&
                        (arg.event.end.getTime() - arg.event.start.getTime()) / 1000 / 60 > 25
                        ? `<div class="fc-event-main-frame"><div class="fc-event-time"><svg viewBox="0 0 100 10"><text x="50%" y="8" text-anchor="middle">${arg.event.start && arg.event.start?.getHours() > 12
                            ? arg.event.start.getHours() - 12
                            : arg.event.start?.getHours()
                        }:${arg.event.start && arg.event.start.getMinutes() < 10 ? '0' : ''
                        }${arg.event.start?.getMinutes()} - ${arg.event.end && arg.event.end?.getHours() > 12
                            ? arg.event.end.getHours() - 12
                            : arg.event.end?.getHours()
                        }:${arg.event.end && arg.event.end.getMinutes() < 10 ? '0' : ''
                        }${arg.event.end?.getMinutes()}</text></svg></div>`
                        : ''
                    }<div class="fc-event-title"><svg viewBox="0 0 95 20">
                                    <text x="50%" y="13" text-anchor="middle">${title}</text>
                                  </svg></div></div>`,
            };
        },
    });

    calendar.render();
});

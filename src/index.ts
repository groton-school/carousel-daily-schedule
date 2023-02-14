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
            url: `feed.php?url=${encodeURIComponent(feed)}`,
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
                    return match[1];
                }
                return arg.event.title;
            }
            const match = /^([^-]+[^A])( A)? -.*/.exec(arg.event.title);
            let title = arg.event.title;
            if (match && match.length) {
                title = match[1];
            }
            return {
                html: `<div class="fc-event-main-frame"><div class="fc-event-time">${arg.event.start && arg.event.start?.getHours() > 12
                        ? arg.event.start.getHours() - 12
                        : arg.event.start?.getHours()
                    }:${arg.event.start && arg.event.start.getMinutes() < 10 ? '0' : ''
                    }${arg.event.start?.getMinutes()} - ${arg.event.end && arg.event.end?.getHours() > 12
                        ? arg.event.end.getHours() - 12
                        : arg.event.end?.getHours()
                    }:${arg.event.end && arg.event.end.getMinutes() < 10 ? '0' : ''
                    }${arg.event.end?.getMinutes()}</div><div class="fc-event-title-container"><div class="fc-event-title fc-sticky">${title}</div></div></div>`,
            };
        },
    });

    calendar.render();
});

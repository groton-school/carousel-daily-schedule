import { Calendar } from '@fullcalendar/core';
import iCalendarPlugin from '@fullcalendar/icalendar';
import timeGridPlugin from '@fullcalendar/timegrid';
import './index.scss';

const params = new URLSearchParams(location.search);

const feed = params.get('ics') || '';
const message = params.get('feed') || 'No classes this week';
const initialDate = params.get('initialDate') || undefined;
const today = initialDate ? new Date(initialDate) : new Date();
const isGRACE =
  (today.getMonth() == 5 && today.getDate() > 15) || today.getMonth() == 6;

document.addEventListener('DOMContentLoaded', function() {
  const calendarEl = document.getElementById('calendar') as HTMLElement;

  const calendar = new Calendar(calendarEl, {
    plugins: [timeGridPlugin, iCalendarPlugin],
    initialView: 'timeGridWeek',
    initialDate,
    titleFormat: { month: 'long', day: 'numeric' },
    headerToolbar: {
      start: 'title',
      center: '',
      end: ''
    },
    dayHeaderContent: (arg) => {
      return arg.date.toLocaleDateString([], {
        weekday: 'long',
        day: 'numeric'
      });
    },
    slotDuration: '00:30:00',
    slotMinTime: '08:00:00',
    slotMaxTime: isGRACE ? '23:30:00' : '16:00:00',
    expandRows: true,
    aspectRatio: 16 / 8,
    events: {
      url: `feed.php?url=${encodeURIComponent(feed)}`,
      format: 'ics'
    },
    eventClassNames: (arg) => {
      let color = 'no-color';
      const match = new RegExp(
        isGRACE
          ? '^(W Block|X Block|Y Block|Z Block|Group Activity|Activity Options|Study Hall or Group Outing|Study Hall)'
          : '^(Red|Orange|Yellow|Green|Dark Blue|Light Blue|Purple)'
      ).exec(arg.event.title);
      if (match && match.length) {
        color = match[1].replace(' ', '-').toLowerCase();
        if (isGRACE) {
          switch (color) {
            case 'activity-options':
            case 'group-activity':
            case 'study-hall-or-group-outing':
              color = 'activity';
              break;
          }
        }
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
      let title = arg.event.title.trim();
      if (match && match.length) {
        title = match[1];
        switch (title) {
          case 'Conference period':
            title = 'Conference';
            break;
          case 'Flex block':
            title = 'Flex';
            break;
          case 'W Block':
          case 'X Block':
          case 'Y Block':
          case 'Z Block':
            title = title.substr(0, 1);
            break;
        }
      } else if (title == 'Check-In - 1 (CK)') {
        title = 'Check-In';
      }

      let time;
      const { start, end } = arg.event;
      const displayTime =
        start &&
        end &&
        (end.getTime() - start.getTime()) / 1000 / 60 > (isGRACE ? 35 : 30);
      if (displayTime) {
        time = `${start?.getHours() > 12 ? start.getHours() - 12 : start?.getHours()
          }:${start.getMinutes() < 10 ? '0' : ''}${start?.getMinutes()} - ${end?.getHours() > 12 ? end.getHours() - 12 : end?.getHours()
          }:${end.getMinutes() < 10 ? '0' : ''}${end?.getMinutes()}`;
      }
      return {
        html: `<div class="fc-event-main-frame">
                        ${displayTime
            ? `
                            <div class="fc-event-time">
                                <svg viewBox="0 0 100 12">
                                    <text x="50%" y="10" text-anchor="middle">
                                        ${time}
                                    </text>
                                </svg>
                            </div>`
            : ''
          }
                    <div class="fc-event-title">
                        ${displayTime
            ? `<svg viewBox="0 0 95 ${isGRACE && / or /.test(title) ? 40 : 20
            }">
                            <text x="50%" y="13" text-anchor="middle">
                                ${isGRACE && / or /.test(title)
              ? `<tspan x="50%" text-anchor="middle" dy="0">${title.replace(
                /(.* or ).*/,
                '$1'
              )}</tspan><tspan x="50%" text-anchor="middle" dy="13">${title.replace(
                /.* or (.*)/,
                '$1'
              )}</tspan>`
              : title
            }
                            </text>
                        </svg>`
            : title
          }
                    </div>
                </div>`
      };
    }
  });

  calendar.render();
  setTimeout(() => {
    if (!document.querySelector('.fc-event')) {
      (
        document.querySelector('#message-wrapper') as HTMLElement
      ).classList.remove('hidden');
      (document.querySelector('#message') as HTMLElement).innerHTML = message;
    }
  }, 10000);
});

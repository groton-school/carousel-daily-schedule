import './index.scss';
import { Calendar } from '@fullcalendar/core';
import iCalendarPlugin from '@fullcalendar/icalendar';
import timeGridPlugin from '@fullcalendar/timegrid';

const EVENT_TYPE = 'fullcalendarInitialRender';

const params = new URLSearchParams(location.search);

const feed = params.get('ics') || params.get('feed') || '';
const message = params.get('message') || 'No classes this week';
const title = params.get('title');
const initialDate = params.get('initialDate') || undefined;
const defaultColor = params.get('defaultColor');

const forceDisplayTimeParam = params.get('forceDisplayTime') || 'false';
let forceDisplayTime = false;
switch (forceDisplayTimeParam.toLowerCase()) {
  case '1':
  case 'true':
  case 'yes':
    forceDisplayTime = true;
}

const svgParam = params.get('svgText') || 'true';
let svgText = true;
switch (svgParam.toLowerCase()) {
  case '0':
  case 'false':
  case 'no':
    svgText = false;
}
const today = initialDate ? new Date(initialDate) : new Date();
const isGRACE =
  (today.getMonth() == 5 && today.getDate() > 15) || today.getMonth() == 6;

const calendarElt = document.getElementById('calendar') as HTMLElement;
const messageElt = document.querySelector('#message') as HTMLElement;

messageElt.innerText = message;

document.addEventListener('DOMContentLoaded', function () {
  const calendar = new Calendar(calendarElt, {
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
          ? '(W Block|X Block|Y Block|Z Block|Group Activity|Activity Options|Study Hall or Group Outing|Study Hall)'
          : '(Red|Orange|Yellow|Green|Dark Blue|Light Blue|Purple)'
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
      let title = arg.event.title.trim();
      const match = /^(.+ - )?(.+) - .+ \(.+\)$/.exec(title);
      if (match && match.length) {
        title = match[2];
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
      } else if (/^Conference period.*/.exec(title)) {
        title = 'Conference';
      } else if (title == 'Check-In - 1 (CK)') {
        title = 'Check-In';
      }

      let time;
      const { start, end } = arg.event;
      let displayTime =
        forceDisplayTime ||
        (start &&
          end &&
          (end.getTime() - start.getTime()) / 1000 / 60 > (isGRACE ? 45 : 30));
      if (displayTime) {
        if (start) {
          if (end) {
            time = `${
              start.getHours() > 12 ? start.getHours() - 12 : start.getHours()
            }:${start.getMinutes() < 10 ? '0' : ''}${start.getMinutes()} - ${
              end.getHours() > 12 ? end.getHours() - 12 : end.getHours()
            }:${end.getMinutes() < 10 ? '0' : ''}${end.getMinutes()}`;
          } else {
            time = `${
              start.getHours() > 12 ? start.getHours() - 12 : start.getHours()
            }:${start.getMinutes() < 10 ? '0' : ''}${start?.getMinutes()}`;
          }
        } else {
          displayTime = false;
        }
      }
      return {
        html: `<div class="fc-event-main-frame">
                        ${
                          displayTime
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
                        ${
                          svgText
                            ? `<svg viewBox="0 0 95 ${
                                isGRACE && / or /.test(title) ? 40 : 20
                              }">
                            <text x="50%" y="13" text-anchor="middle">
                                ${
                                  isGRACE && / or /.test(title)
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

  const observer = new MutationObserver((mutations, observer) => {
    const elt = mutations.find((mutation) =>
      Array.from(mutation.addedNodes).find((node) => {
        const elt = node as HTMLElement;
        return (
          elt.classList.contains('fc-timegrid-event-harness') ||
          elt.classList.contains('fc-daygrid-event-harness')
        );
      })
    );
    if (elt) {
      observer.disconnect();
      calendarElt.dispatchEvent(new CustomEvent(EVENT_TYPE));
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  calendarElt.addEventListener(EVENT_TYPE, () => {
    // hide message if any scheduled events are visible
    if (calendarElt.querySelector('.fc-timegrid-event-harness')) {
      messageElt.parentElement?.classList.add('hidden');
    }

    // hide duplicates
    Array.from(
      calendarElt.querySelectorAll(
        '.fc-timegrid-event-harness-inset[style*="50%"]'
      )
    ).forEach((node) => {
      const elt = node as HTMLElement;
      if (elt.innerHTML == elt.previousElementSibling?.innerHTML) {
        elt.classList.add('hidden');
      }
    });

    // hide empty day-long events
    Array.from(
      calendarElt.querySelectorAll(
        '.fc-daygrid-event-harness:has(a):has(div:empty)'
      )
    ).forEach((node) => (node as HTMLElement).classList.add('hidden'));

    // replace title if parameter present
    if (title) {
      const header = calendarElt.querySelector(
        '.fc-toolbar-title'
      ) as HTMLElement;
      header.innerText = title.replace('{{Date}}', header.innerText);
    }

    // change color of default blocks
    if (defaultColor) {
      calendarElt.style.setProperty('--no-color', defaultColor);
    }
  });

  calendar.render();
});

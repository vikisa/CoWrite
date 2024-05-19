import dayjs from 'dayjs';

import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Europe/Moscow');

import ru from 'dayjs/locale/ru';
dayjs.locale('ru');

import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

export default {
  install: (app) => {
    Object.defineProperties(app.config.globalProperties, {
      $date: {
        get() {
          return dayjs;
        },
      },
    });
  },
};

import ElementPlus from 'element-plus';

import 'element-plus/dist/index.css';
import ru from 'element-plus/dist/locale/ru.mjs'

export default {
  install: (app) => {
    app.use(ElementPlus, {
      locale: ru,
    });
  },
};

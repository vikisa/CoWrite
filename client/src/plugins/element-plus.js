import ElementPlus from 'element-plus';
import ru from 'element-plus/dist/locale/ru.mjs'
import '@/assets/element-variables.scss';

export default {
  install: (app) => {
    app.use(ElementPlus, {
      locale: ru,
    });
  },
};

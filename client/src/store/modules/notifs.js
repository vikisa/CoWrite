import { ElNotification } from "element-plus";

const state = {
  type: 'success',
  duration: 5000,
};

const getters = {
  showNotification: (state, getters) => (message, type, duration, additionalProperty) => {
    const options = {
      message: message,
      type: type || state.type,
      duration: duration ?? state.duration,
      offset: 60,
    }
    ElNotification(Object.assign(options, additionalProperty))
  },
};

export default {
  state,
  getters
};

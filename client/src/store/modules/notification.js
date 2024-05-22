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
    }
    ElNotification(Object.assign(options, additionalProperty))
  },
};

export default {
  state,
  getters
};

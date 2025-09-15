import axios from "axios";
import { loadProgressBar } from "axios-progress-bar";
import NProgress from "nprogress";

const API_URL = import.meta.env.VITE_API_URL;

const $api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

loadProgressBar({}, $api);

let activeRequests = 0;

$api.interceptors.request.use(
  config => {
    activeRequests++;
    if (activeRequests === 1) {
      NProgress.start();
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

$api.interceptors.response.use(
  response => {
    activeRequests--;
    if (activeRequests < 1) {
      NProgress.done();
    }
    return response;
  },
  error => {
    activeRequests--;
    if (activeRequests < 1) {
      NProgress.done();
    }
    return Promise.reject(error);
  },
);

// $api.interceptors.request.use(config => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// function handleResponse() {
//   const errorsStore = useErrorsStore();
//   return $api.interceptors.response.use(
//     response => {
//       return response;
//     },
//     error => {
//       const errorMsg =
//         error?.response?.data?.message || "Произошла неизвестная ошибка";
//       errorsStore.showError(errorMsg);
//       console.log(errorMsg);
//       return Promise.reject(error);
//     },
//   );
// }

export default $api;
// export { handleResponse };

import axios from 'axios';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: CONFIG.site.okxApiUrl,
  headers: {
    'OK-ACCESS-KEY': process.env.REACT_APP_OKX_API_KEY,
    'OK-ACCESS-PASSPHRASE': process.env.REACT_APP_OKX_API_PASSPHRASE,
  }
});

axiosInstance.interceptors.request.use(
  (config) => {
    const timestamp = new Date().toISOString()
    const signature = CryptoJS.enc.Base64.stringify(
      CryptoJS.HmacSHA256(`${timestamp}${config.method.toUpperCase()}${config.url}`, process.env.REACT_APP_OKX_API_SECRET)
    );

    config.headers['OK-ACCESS-SIGN'] = signature;
    config.headers['OK-ACCESS-TIMESTAMP'] = timestamp;

    return config
  },
  (error) => console.log('hello puta', error) && Promise.reject((error.response && error.response.data) || 'Something went wrong!')
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/api/auth/me',
    signIn: '/api/auth/sign-in',
    signUp: '/api/auth/sign-up',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
};

export const ENV = {
  DEV: 'development',
  PROD: 'production',
  TEST: 'test',
  QA: 'qa',
};

export const BASE_URL = 'http://13.233.110.164:8090/api/v1/'; // Live URL

export const HEADERS = {
  'Content-Type': 'application/json',
};

export const API_URL = {
  LOGIN: 'customers/authenticate',
  SIGNUP: 'customers',
  SUPPLIER_LOGIN: 'suppliers/authenticate',
  SUPPLIER_SIGNUP: 'suppliers',
  PRODUCTS: 'products',
  SUPPLIER: 'suppliers',
  CUSTOMER: 'customers',
  CART: 'cart',
  DRIVER: 'drivers',
  ORDER: 'orders',
  TRACKING: 'orderTracking',
};

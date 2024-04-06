import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL, HEADERS as headers} from './Config';

class APIClient {
  static timeout = 15000;

  apiClient: any;

  constructor() {
    const config = {
      baseURL: BASE_URL,
      headers,
      timeout: APIClient.timeout,
    };
    this.apiClient = axios.create({
      baseURL: BASE_URL,
      headers,
      timeout: APIClient.timeout,
    });
    this.apiClient.config = config;
    this.reset = this.reset.bind(this);
    this.get = this.get.bind(this);
    this.post = this.post.bind(this);
    this.put = this.put.bind(this);
    this.delete = this.delete.bind(this);
    this.handleResponse = this.handleResponse.bind(this);
    this.handleError = this.handleError.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
  }

  reset() {
    this.apiClient = null;
  }

  removeToken() {
    delete this.apiClient.defaults.headers.common.Authorization;
  }

  updateHeader(obj: any) {
    const updateHeader = () => {
      Object.keys(obj).forEach(k => {
        this.apiClient.defaults.headers.common[k] = obj[k];
      });
    };
    if (this.apiClient) {
      updateHeader();
    }
  }

  updateAuthToken(token = null) {
    const Authorization = `Bearer ${token}`;
    this.updateHeader({Authorization});
  }

  async getAccessToken() {
    let userData: any = await AsyncStorage.getItem('token');
    if (userData) {
      return userData;
    }
    return false;
  }

  async get(url: string) {
    const token = await this.getAccessToken();
    !!token && this.updateAuthToken(token);
    return new Promise((resolve, reject) => {
      this.apiClient
        .get(url)
        .then((response: any) => {
          this.handleResponse(response, resolve);
        })
        .catch((error: any) => {
          console.log('error=>get', error);
          this.handleError(error, reject);
        });
    });
  }

  async delete(url: string) {
    const token = await this.getAccessToken();
    !!token && this.updateAuthToken(token);
    return new Promise((resolve, reject) => {
      this.apiClient
        .delete(BASE_URL + url)
        .then((response: any) => {
          this.handleResponse(response, resolve);
        })
        .catch((error: any) => {
          this.handleError(error, reject);
        });
    });
  }

  async post(url: string, params: any) {
    const token = await this.getAccessToken();
    !!token && this.updateAuthToken(token);
    return new Promise((resolve, reject) => {
      this.apiClient
        .post(url, JSON.stringify(params))
        .then((response: any) => {
          console.log('response', response);
          this.handleResponse(response, resolve);
        })
        .catch((error: any) => {
          console.log('error=> post', error);
          this.handleError(error, reject);
        });
    });
  }

  async put(url: string, params: any) {
    const token = await this.getAccessToken();
    !!token && this.updateAuthToken(token);
    return new Promise((resolve, reject) => {
      this.apiClient
        .put(url, JSON.stringify(params))
        .then((response: any) => {
          this.handleResponse(response, resolve);
        })
        .catch((error: any) => {
          this.handleError(error, reject);
        });
    });
  }

  async patch(url: string, params: any) {
    const token = await this.getAccessToken();
    !!token && this.updateAuthToken(token);
    return new Promise((resolve, reject) => {
      this.apiClient
        .patch(url, params)
        .then((response: any) => {
          this.handleResponse(response, resolve);
        })
        .catch((error: any) => {
          this.handleError(error, reject);
        });
    });
  }

  handleResponse(response: any, resolve: any) {
    resolve(response.data);
  }

  handleError(error: any, reject: any) {
    console.log(error?.response);
    reject(error?.response ? error.response.data : {error: error.message});
    if (error?.message === 'Network Error') {
      // Toast({
      //   message: 'You are Offline, Please Check your internet connection',
      //   type: 'error',
      //   position: 'bottom',
      // });
    }
  }
}

export default new APIClient();

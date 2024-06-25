import ApiClient from 'networking/ApiClient';
import {API_URL} from 'networking/Config';

const AuthService = {};

AuthService.login = async data => ApiClient.post(`${API_URL.LOGIN}`, data);

AuthService.signUp = async data => ApiClient.post(`${API_URL.SIGNUP}`, data);

AuthService.getCustomer = async id =>
  ApiClient.get(`${API_URL.CUSTOMER}/${id}`);

AuthService.getCustomerByToken = async id =>
  ApiClient.get(`${API_URL.CUSTOMER}/getByToken`);

AuthService.getSupplierByToken = async id =>
  ApiClient.get(`${API_URL.SUPPLIER}/getByToken`);

AuthService.supplier_login = async data =>
  ApiClient.post(`${API_URL.SUPPLIER_LOGIN}`, data);

AuthService.supplier_signUp = async data =>
  ApiClient.post(`${API_URL.SUPPLIER_SIGNUP}`, data);

AuthService.getSupplier = async id =>
  ApiClient.get(`${API_URL.SUPPLIER}/${id}`);

AuthService.updateSupplierProfilePicture = async id =>
  ApiClient.post(`${API_URL.SUPPLIER}/${id.id}/addBusinessImage`, id.payload);

AuthService.updateCustomerProfilePicture = async id =>
  ApiClient.post(
    `${API_URL.CUSTOMER}/${id.id}/uploadProfilePicture`,
    id.payload,
  );

AuthService.updateDriverProfilePicture = async id =>
  ApiClient.post(`${API_URL.DRIVER}/${id.id}/uploadProfilePicture`, id.payload);

AuthService.driver_login = async data =>
  ApiClient.post(`${API_URL.DRIVER}/authenticate`, data);

AuthService.driver_signUp = async data =>
  ApiClient.post(`${API_URL.DRIVER}`, data);

AuthService.deleteCustomer = async id =>
  ApiClient.delete(`${API_URL.CUSTOMER}/${id}`);
AuthService.deleteSupplier = async id =>
  ApiClient.delete(`${API_URL.SUPPLIER}/${id}`);
AuthService.deleteDriver = async id =>
  ApiClient.delete(`${API_URL.DRIVER}/${id}`);

export default AuthService;

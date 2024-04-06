import ApiClient from 'networking/ApiClient';
import {API_URL} from 'networking/Config';

const DriverService = {};

DriverService.drivers = async data => ApiClient.get(`${API_URL.DRIVER}`);

DriverService.getDriver = async data =>
  ApiClient.get(`${API_URL.DRIVER}/${data?.id}`);

DriverService.driverIdByToken = async data =>
  ApiClient.get(`${API_URL.DRIVER}/getByToken`);

// DriverService.getCartData = async data =>
//   ApiClient.get(`${API_URL.CART}/${data}`);

DriverService.updateDriver = async data =>
  ApiClient.put(`${API_URL.DRIVER}/${data.id}`, data);

DriverService.deleteDriver = async data =>
  ApiClient.delete(`${API_URL.DRIVER}/${data.id}`, {});

DriverService.reset_password = async id =>
  ApiClient.get(`${API_URL.DRIVER}/${id}/reset-password`);

export default DriverService;

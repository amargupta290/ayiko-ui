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

DriverService.startDelivery = async data =>
  ApiClient.post(`${API_URL.ORDER}/${data.id}/startDelivery`, data);

DriverService.completeDelivery = async data =>
  ApiClient.post(`${API_URL.ORDER}/${data.id}/completeDelivery`, data);

DriverService.driverRejected = async data =>
  ApiClient.post(`${API_URL.ORDER}/${data.id}/driverRejected`, data);

DriverService.driverAccepted = async data =>
  ApiClient.post(`${API_URL.ORDER}/${data.id}/driverAccepted`, data);

DriverService.assignToSelf = async data =>
  ApiClient.post(`${API_URL.ORDER}/${data.id}/assignToSelf`, data);

DriverService.assignDriver = async data =>
  ApiClient.post(
    `${API_URL.ORDER}/${data.id}/assignDriver/${data?.driver_id}`,
    data,
  );

DriverService.orderDetails = async id =>
  ApiClient.get(`${API_URL.ORDER}/${id}`);

DriverService.driverOrders = async id =>
  ApiClient.get(`${API_URL.ORDER}/driver`);

DriverService.customerOrders = async id =>
  ApiClient.get(`${API_URL.ORDER}/customer`);

DriverService.sendDriverLocationCoords = async data =>
  ApiClient.post(
    `${API_URL.TRACKING}/trackOrder/${data?.id}`,
    data?.locationData,
  );

DriverService.getDriverLocationCoords = async id =>
  ApiClient.get(`${API_URL.TRACKING}/trackOrder/${id}`);

export default DriverService;

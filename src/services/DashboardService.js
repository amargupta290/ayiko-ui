import ApiClient from 'networking/ApiClient';
import {API_URL} from 'networking/Config';

const DashboardService = {};

DashboardService.catalogList = async => ApiClient.get(`${API_URL.PRODUCTS}`);
DashboardService.supplierList = async => ApiClient.get(`${API_URL.SUPPLIER}`);
DashboardService.popularProductsList = async =>
  ApiClient.get(`${API_URL.PRODUCTS}/popular`);
DashboardService.addAddresses = async data =>
  ApiClient.post(`${API_URL.CUSTOMER}/${data.id}/addAddress`, data.data);
DashboardService.deleteAddress = async data =>
  ApiClient.delete(
    `${API_URL.CUSTOMER}/${data?.id}/deleteAddress/${data?.addressId}`,
  );

export default DashboardService;

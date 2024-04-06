import ApiClient from 'networking/ApiClient';
import {API_URL} from 'networking/Config';

const DashboardService = {};

DashboardService.catalogList = async => ApiClient.get(`${API_URL.PRODUCTS}`);
DashboardService.supplierList = async => ApiClient.get(`${API_URL.SUPPLIER}`);
DashboardService.popularProductsList = async =>
  ApiClient.get(`${API_URL.PRODUCTS}/popular`);

export default DashboardService;

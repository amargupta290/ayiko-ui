import ApiClient from 'networking/ApiClient';
import {API_URL} from 'networking/Config';

const SupplierService = {};

SupplierService.supplierDetails = async id =>
  ApiClient.get(`${API_URL.SUPPLIER}/${id}`);

SupplierService.popularProductsList = async =>
  ApiClient.get(`${API_URL.PRODUCTS}/popular`);

SupplierService.supplierProducts = async id =>
  ApiClient.get(`${API_URL.SUPPLIER}/${id}/products`);

SupplierService.supplierApprovalRequest = async data =>
  ApiClient.get(`${API_URL.SUPPLIER}/${data.id}/carts?status=${data?.status}`);

SupplierService.updateSupplier = async data =>
  ApiClient.put(`${API_URL.SUPPLIER}/${data.id}`, data);

export default SupplierService;

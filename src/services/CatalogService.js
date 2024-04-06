import ApiClient from 'networking/ApiClient';
import {API_URL} from 'networking/Config';

const CatalogService = {};

CatalogService.catalogList = async id =>
  ApiClient.get(`${API_URL.SUPPLIER}/${id}/products`);
CatalogService.catalogCreate = async data =>
  ApiClient.post(`${API_URL.PRODUCTS}`, data);
CatalogService.catalogUpdate = async data =>
  ApiClient.put(`${API_URL.PRODUCTS}/${data.id}`, data);

export default CatalogService;

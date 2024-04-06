import ApiClient from 'networking/ApiClient';
import {API_URL} from 'networking/Config';

const CartService = {};

CartService.sendForApproval = async data =>
  ApiClient.post(`${API_URL.CART}/sendForApproval`, data);

CartService.AcceptCart = async data =>
  ApiClient.post(`${API_URL.CART}/${data?.id}/acceptCart`, {});

CartService.RejectCart = async data =>
  ApiClient.post(`${API_URL.CART}/${data?.id}/rejectCart`, {});

CartService.getCartData = async data =>
  ApiClient.get(`${API_URL.CART}/${data}`);

CartService.addPaymentConfirmationStatus = async data =>
  ApiClient.post(
    `${API_URL.CART}/${data.id}/addPaymentConfirmationStatus`,
    data,
  );

CartService.addPaymentReceiptStatus = async data =>
  ApiClient.post(
    `${API_URL.CART}/${data.id}/addPaymentReceiptStatus?status=${data?.status}`,
    data,
  );

CartService.getCartList = async id =>
  ApiClient.get(`${API_URL.CUSTOMER}/${id}/carts`);

export default CartService;

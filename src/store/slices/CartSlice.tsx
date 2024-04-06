import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit';
import {CartService} from 'services';
import SupplierService from 'services/SupplierService';
import globalHelpers from '../../utils/helpers';

export interface DataI {
  id: null;
  status: boolean;
  statusCode: number;
  message: string;
}
export interface CartState {
  loading: boolean;
  message: string;
  showMessage: boolean;
  data: DataI | null;
  sendForApprovalData: DataI | null;
  acceptCartData: DataI | null;
  cartDetailsData: DataI | null;
  paymentStatusData: DataI | null;
  cartListData: DataI | null;
  rejectCartData: DataI | null;
}

export const initialState: CartState = {
  loading: false,
  message: '',
  showMessage: false,
  data: null,
  sendForApprovalData: null,
  rejectCartData: null,
  acceptCartData: null,
  cartDetailsData: null,
  paymentStatusData: null,
  cartListData: null,
};

export const getLocalCart = async () => {
  let cartData = await AsyncStorage.getItem('cart')
    .then(res => {
      console.log('hide_intro res', res);
      if (res) {
        return JSON.parse(res);
      } else {
        return null;
      }
    })
    .catch(err => {
      console.log('hide_intro err', err);
      return null;
    });
  return cartData;
};

export const setCarItem = async (
  item: any,
  action = 'add',
  quantity: number | string,
  setQuantity: any,
) => {
  let cart: any = await getLocalCart();

  if (!cart && globalHelpers.isEmpty(cart?.items)) {
    cart = {
      items: {},
      totalPrice: 0,
      supplierId: item?.supplierId,
    };
    cart.totalPrice = 0;
    cart.totalPrice = Number(item.unitPrice);
    cart.items[item.id] = {...item};
    cart.items[item.id].quantity = 1;
    console.log(
      'setCarItem !cart !cart?.items ',
      JSON.stringify(cart, null, 2),
    );
  } else if (cart && cart?.items[item.id]) {
    console.log(
      'setCarItem cart && cart?.items[item.id] ',
      JSON.stringify(cart, null, 2),
    );
    if (action) {
      cart.items[item.id].quantity = Number(quantity) + 1;
      cart.totalPrice = Number(
        Number(cart.items[item.id].unitPrice) *
          Number(cart.items[item.id].quantity) +
          Number(cart.totalPrice),
      );
      console.log(
        'setCarItem cart && cart?.items[item.id] ADDDDDD',
        JSON.stringify(cart, null, 2),
      );
    } else {
      cart.items[item.id].quantity = Number(cart.items[item.id].quantity) - 1;
      cart.totalPrice = Number(
        Number(cart.items[item.id].unitPrice) - Number(cart.totalPrice),
      );
      console.log(
        'setCarItem cart && cart?.items[item.id] DEDUCTTTTT',
        JSON.stringify(cart, null, 2),
      );
      if (cart.items[item.id].quantity == 0) {
        delete cart.items[item.id];
        console.log(
          'setCarItem cart && cart?.items[item.id] REMOVEEEEE',
          JSON.stringify(cart, null, 2),
        );
      }
    }
  } else if (action) {
    console.log('add new');
    cart.totalPrice = 0;
    cart.totalPrice = Number(item.unitPrice);
    cart.items[item.id] = {...item};
    cart.items[item.id].quantity = 1;
    console.log(
      'setCarItem cart && cart?.items[item.id] action ADDDDDD',
      JSON.stringify(cart, null, 2),
    );
  } else {
    if (cart && globalHelpers.isEmpty(cart?.items)) {
      console.log('setCarItem CLEAR CART', JSON.stringify(cart, null, 2));
      await AsyncStorage.removeItem('cart');
    }
    return;
  }

  if (cart && globalHelpers.isEmpty(cart.items)) {
    console.log('setCarItem CLEAR CART', JSON.stringify(cart, null, 2));
    await AsyncStorage.removeItem('cart');
    return;
  }

  console.log('add to cart : ', JSON.stringify(cart, null, 2));
  await AsyncStorage.setItem('cart', JSON.stringify(cart));
  await getItemQuantity(item, setQuantity);
};

export const getItemQuantity = async (item: any, setQuantity: any) => {
  let cart: any = await getLocalCart();
  console.log('getItemQuantity cart', cart);
  if (!cart?.items) {
    setQuantity(0);
    // return item?.quantity;
  } else if (cart) {
    if (cart.items[item.id]) {
      setQuantity(cart?.items[item.id]?.quantity);
      console.log('cart?.items[`${item.id}`]', cart?.items[item.id]);
    } else {
      setQuantity(0);
    }
  }
};

export const returnItemQuantity = async (item: any) => {
  let cart: any = await getLocalCart();
  console.log('getItemQuantity cart', cart);
  if (!cart?.items) {
    return 0;
    // return item?.quantity;
  } else if (cart) {
    if (cart.items[item.id]) {
      return cart?.items[item.id]?.quantity;
    } else {
      return 0;
    }
  }
};

export const sendForApproval = createAsyncThunk(
  'cart/sendForApproval',
  async (data, {rejectWithValue}) => {
    try {
      const response = await CartService.sendForApproval(data);
      console.log('sendForApproval res', response);
      return response;
    } catch (err) {
      console.log('cart/sendForApproval', err);
      return rejectWithValue(err);
    }
  },
);

export const acceptCart = createAsyncThunk(
  'cart/acceptCart',
  async (data, {rejectWithValue}) => {
    try {
      const response = await CartService.AcceptCart(data);
      return response;
    } catch (err) {
      console.log('cart/acceptCart', err);
      return rejectWithValue(err);
    }
  },
);

export const rejectCart = createAsyncThunk(
  'cart/rejectCart',
  async (data, {rejectWithValue}) => {
    try {
      const response = await CartService.RejectCart(data);
      return response;
    } catch (err) {
      console.log('cart/acceptCart', err);
      return rejectWithValue(err);
    }
  },
);

export const checkPaymentStatus = createAsyncThunk(
  'cart/checkPaymentStatus',
  async (data, {rejectWithValue}) => {
    try {
      const response = await CartService.addPaymentConfirmationStatus(data);
      console.log('ressss', response);
      return response;
    } catch (err) {
      console.log('cart/checkPaymentStatus', err);
      return rejectWithValue(err);
    }
  },
);

export const updatePaymentStatus = createAsyncThunk(
  'cart/updatePaymentStatus',
  async (data, {rejectWithValue}) => {
    try {
      const response = await CartService.addPaymentReceiptStatus(data);
      console.log('ressss', response);
      return response;
    } catch (err) {
      console.log('cart/updatePaymentStatus', err);
      return rejectWithValue(err);
    }
  },
);

export const getCartDetails = createAsyncThunk(
  'cart/getCartDetails',
  async (id, {rejectWithValue}) => {
    try {
      const response = await CartService.getCartData(id);

      return response;
    } catch (err) {
      console.log('cart/getCartDetails', err);
      return rejectWithValue(err);
    }
  },
);

export const getCartList = createAsyncThunk(
  'cart/getCartList',
  async (id, {rejectWithValue}) => {
    try {
      const response = await CartService.getCartList(id);

      return response;
    } catch (err) {
      console.log('cart/getCartList', err);
      return rejectWithValue(err);
    }
  },
);

export const CartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    showLoading: state => {
      state.loading = true;
    },
  },
  extraReducers: builder => {
    builder.addCase(sendForApproval.pending, state => {
      state.loading = true;
    });
    builder.addCase(
      sendForApproval.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.sendForApprovalData = action.payload;
      },
    );
    builder.addCase(
      sendForApproval.rejected,
      (state, action: PayloadAction<any>) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      },
    );
    //acceptCart
    builder.addCase(acceptCart.pending, state => {
      state.loading = true;
    });
    builder.addCase(
      acceptCart.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.acceptCartData = action.payload;
      },
    );
    builder.addCase(
      acceptCart.rejected,
      (state, action: PayloadAction<any>) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      },
    );

    //rejectCart
    builder.addCase(rejectCart.pending, state => {
      state.loading = true;
    });
    builder.addCase(
      rejectCart.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.rejectCartData = action.payload;
      },
    );
    builder.addCase(
      rejectCart.rejected,
      (state, action: PayloadAction<any>) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      },
    );

    //getCartDetails
    builder.addCase(getCartDetails.pending, state => {
      state.loading = true;
    });
    builder.addCase(
      getCartDetails.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.cartDetailsData = action.payload;
      },
    );
    builder.addCase(
      getCartDetails.rejected,
      (state, action: PayloadAction<any>) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      },
    );

    //checkPaymentStatus
    builder.addCase(checkPaymentStatus.pending, state => {
      state.loading = true;
    });
    builder.addCase(
      checkPaymentStatus.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.paymentStatusData = action.payload;
      },
    );
    builder.addCase(
      checkPaymentStatus.rejected,
      (state, action: PayloadAction<any>) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      },
    );

    //updatePaymentStatus
    builder.addCase(updatePaymentStatus.pending, state => {
      state.loading = true;
    });
    builder.addCase(
      updatePaymentStatus.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.paymentStatusData = action.payload;
      },
    );
    builder.addCase(
      updatePaymentStatus.rejected,
      (state, action: PayloadAction<any>) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      },
    );

    //getCartList
    builder.addCase(getCartList.pending, state => {
      state.loading = true;
    });
    builder.addCase(
      getCartList.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.cartListData = action.payload;
      },
    );
    builder.addCase(
      getCartList.rejected,
      (state, action: PayloadAction<any>) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      },
    );
  },
});

export const {showLoading} = CartSlice.actions;

export default CartSlice.reducer;

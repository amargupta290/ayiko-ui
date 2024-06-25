import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit';
import SupplierService from 'services/SupplierService';

export interface DataI {
  status: boolean;
  statusCode: number;
  message: string;
}
export interface DashboardState {
  loading: boolean;
  message: string;
  showMessage: boolean;
  data: DataI | null;
  supplierDetailsData: DataI | null;
  supplierProductsData: DataI | null;
  supplierApprovalRequestData: DataI | null;
  updateSupplierData: DataI | null;
  supplierOrdersData: DataI | null | [];
}

export const initialState: DashboardState = {
  loading: false,
  message: '',
  showMessage: false,
  data: null,
  supplierDetailsData: null,
  supplierProductsData: null,
  supplierApprovalRequestData: null,
  updateSupplierData: null,
  supplierOrdersData: [],
};

export const supplierDetails = createAsyncThunk(
  'supplier/details',
  async (id, {rejectWithValue}) => {
    try {
      const response = await SupplierService.supplierDetails(id);
      return response;
    } catch (err) {
      console.log('supplier/details', err);
      return rejectWithValue(err);
    }
  },
);

export const supplierProducts = createAsyncThunk(
  'supplier/products',
  async (id, {rejectWithValue}) => {
    try {
      const response = await SupplierService.supplierProducts(id);
      return response;
    } catch (err) {
      console.log('supplier/products', err);
      return rejectWithValue(err);
    }
  },
);

export const supplierOrders = createAsyncThunk(
  'supplier/Orders',
  async (id, {rejectWithValue}) => {
    try {
      const response = await SupplierService.supplierOrders();
      return response;
    } catch (err) {
      console.log('supplier/Orders', err);
      return rejectWithValue(err);
    }
  },
);

export const supplierApprovalRequest = createAsyncThunk(
  'supplier/supplierApprovalRequest',
  async (data, {rejectWithValue}) => {
    try {
      const response = await SupplierService.supplierApprovalRequest(data);
      return response;
    } catch (err) {
      console.log('supplier/products', err);
      return rejectWithValue(err);
    }
  },
);

export const updateSupplier = createAsyncThunk(
  'supplier/updateSupplier',
  async (data, {rejectWithValue}) => {
    try {
      const response = await SupplierService.updateSupplier(data);
      return response;
    } catch (err) {
      console.log('supplier/updateSupplier', err);
      return rejectWithValue(err);
    }
  },
);

export const supplierSlice = createSlice({
  name: 'supplier',
  initialState,
  reducers: {
    showLoading: state => {
      state.loading = true;
    },
  },
  extraReducers: builder => {
    builder.addCase(supplierDetails.pending, state => {
      state.loading = true;
    });
    builder.addCase(
      supplierDetails.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.supplierDetailsData = action.payload;
      },
    );
    builder.addCase(
      supplierDetails.rejected,
      (state, action: PayloadAction<any>) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      },
    );
    //supplierApprovalRequest
    builder.addCase(supplierProducts.pending, state => {
      state.loading = true;
    });
    builder.addCase(
      supplierProducts.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.supplierProductsData = action.payload;
      },
    );
    builder.addCase(
      supplierProducts.rejected,
      (state, action: PayloadAction<any>) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      },
    );

    //supplierOrders
    builder.addCase(supplierOrders.pending, state => {
      state.loading = true;
    });
    builder.addCase(
      supplierOrders.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.supplierOrdersData = action.payload;
      },
    );
    builder.addCase(
      supplierOrders.rejected,
      (state, action: PayloadAction<any>) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      },
    );

    //supplierApprovalRequest
    builder.addCase(supplierApprovalRequest.pending, state => {
      state.loading = true;
    });
    builder.addCase(
      supplierApprovalRequest.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.supplierApprovalRequestData = action.payload;
      },
    );
    builder.addCase(
      supplierApprovalRequest.rejected,
      (state, action: PayloadAction<any>) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      },
    );
    //updateSupplier
    builder.addCase(updateSupplier.pending, state => {
      state.loading = true;
    });
    builder.addCase(
      updateSupplier.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.updateSupplierData = action.payload;
      },
    );
    builder.addCase(
      updateSupplier.rejected,
      (state, action: PayloadAction<any>) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      },
    );
  },
});

export const {showLoading} = supplierSlice.actions;

export default supplierSlice.reducer;

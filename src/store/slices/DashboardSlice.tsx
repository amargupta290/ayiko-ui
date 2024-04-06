import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit';
import {DashboardService} from 'services';

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
  supplier: DataI | null;
  popularProducts: DataI | null;
}

export const initialState: DashboardState = {
  loading: false,
  message: '',
  showMessage: false,
  data: null,
  supplier: null,
  popularProducts: null,
};

export const catalogList = createAsyncThunk(
  'catalog/list',
  async (_, {rejectWithValue}) => {
    try {
      const response = await DashboardService.catalogList();
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const supplierList = createAsyncThunk(
  'supplier/list',
  async (_, {rejectWithValue}) => {
    try {
      const response = await DashboardService.supplierList();
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const popularProductsList = createAsyncThunk(
  'products/popular/list',
  async (_, {rejectWithValue}) => {
    try {
      const response = await DashboardService.popularProductsList();
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    showLoading: state => {
      state.loading = true;
    },
  },
  extraReducers: builder => {
    builder.addCase(catalogList.pending, state => {
      state.loading = true;
    });
    builder.addCase(
      catalogList.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.data = action.payload;
      },
    );
    builder.addCase(
      catalogList.rejected,
      (state, action: PayloadAction<any>) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      },
    );

    builder.addCase(supplierList.pending, state => {
      state.loading = true;
    });
    builder.addCase(
      supplierList.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.supplier = action.payload;
      },
    );
    builder.addCase(
      supplierList.rejected,
      (state, action: PayloadAction<any>) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      },
    );

    builder.addCase(popularProductsList.pending, state => {
      state.loading = true;
    });
    builder.addCase(
      popularProductsList.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.popularProducts = action.payload;
      },
    );
    builder.addCase(
      popularProductsList.rejected,
      (state, action: PayloadAction<any>) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      },
    );
  },
});

export const {showLoading} = dashboardSlice.actions;

export default dashboardSlice.reducer;

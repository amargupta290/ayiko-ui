import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit';
import {CatalogService} from 'services';

export interface DataI {
  id: string;
  name: string;
  description: string;
  category: string;
  supplierId: string;
  unitPrice: string;
  quantity: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  available: boolean;
}
export interface catalogState {
  loading: boolean;
  message: string;
  showMessage: boolean;
  data: DataI | [];
}

export const initialState: catalogState = {
  loading: false,
  message: '',
  showMessage: false,
  data: [],
};

export const catalogList = createAsyncThunk(
  'catalog/list',
  async (id, {rejectWithValue}) => {
    try {
      const response = await CatalogService.catalogList(id);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const catalogCreate = createAsyncThunk(
  'catalog/create',
  async (data, {rejectWithValue}) => {
    try {
      const response = await CatalogService.catalogCreate(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const catalogUpdate = createAsyncThunk(
  'catalog/update',
  async (data, {rejectWithValue}) => {
    try {
      const response = await CatalogService.catalogUpdate(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const catalogSlice = createSlice({
  name: 'catalog',
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
    builder.addCase(catalogCreate.pending, state => {
      state.loading = true;
    });
    builder.addCase(
      catalogCreate.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.data = [...state.data, action.payload];
      },
    );
    builder.addCase(
      catalogCreate.rejected,
      (state, action: PayloadAction<any>) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      },
    );
    builder.addCase(catalogUpdate.pending, state => {
      state.loading = true;
    });
    builder.addCase(
      catalogUpdate.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.data = state.data?.map(item =>
          item.id === action.payload?.id ? action.payload : item,
        );
      },
    );
    builder.addCase(
      catalogUpdate.rejected,
      (state, action: PayloadAction<any>) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      },
    );
  },
});

export const {showLoading} = catalogSlice.actions;

export default catalogSlice.reducer;

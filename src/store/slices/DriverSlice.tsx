import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit';
import DriverService from 'services/DriverService';

export interface DataI {
  status: boolean;
  statusCode: number;
  message: string;
}
export interface DriverState {
  loading: boolean;
  message: string;
  showMessage: boolean;
  data: DataI | null;
  driverDetailsData: DataI | null;
  deleteDriverData: DataI | null;
  resetDriverPasswordData: DataI | null;
  updateDriverData: DataI | null;
}

export const initialState: DriverState = {
  loading: false,
  message: '',
  showMessage: false,
  data: null,
  driverDetailsData: null,
  deleteDriverData: null,
  resetDriverPasswordData: null,
  updateDriverData: null,
};

export const driverDetails = createAsyncThunk(
  'driver/details',
  async (id, {rejectWithValue}) => {
    try {
      const response = await DriverService.getDriver(id);
      return response;
    } catch (err) {
      console.log('driver/details', err);
      return rejectWithValue(err);
    }
  },
);

export const deleteDriver = createAsyncThunk(
  'driver/products',
  async (id, {rejectWithValue}) => {
    try {
      const response = await DriverService.deleteDriver(id);
      return response;
    } catch (err) {
      console.log('driver/products', err);
      return rejectWithValue(err);
    }
  },
);

export const resetDriverPassword = createAsyncThunk(
  'driver/resetDriverPassword',
  async (data, {rejectWithValue}) => {
    try {
      const response = await DriverService.reset_password(data);
      return response;
    } catch (err) {
      console.log('driver/products', err);
      return rejectWithValue(err);
    }
  },
);

export const updateDriver = createAsyncThunk(
  'driver/updateDriver',
  async (data, {rejectWithValue}) => {
    try {
      const response = await DriverService.updateDriver(data);
      return response;
    } catch (err) {
      console.log('driver/updateDriver', err);
      return rejectWithValue(err);
    }
  },
);

export const DriverSlice = createSlice({
  name: 'driver',
  initialState,
  reducers: {
    showLoading: state => {
      state.loading = true;
    },
  },
  extraReducers: builder => {
    builder.addCase(driverDetails.pending, state => {
      state.loading = true;
    });
    builder.addCase(
      driverDetails.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.driverDetailsData = action.payload;
      },
    );
    builder.addCase(
      driverDetails.rejected,
      (state, action: PayloadAction<any>) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      },
    );
    //resetDriverPassword
    builder.addCase(deleteDriver.pending, state => {
      state.loading = true;
    });
    builder.addCase(
      deleteDriver.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.deleteDriverData = action.payload;
      },
    );
    builder.addCase(
      deleteDriver.rejected,
      (state, action: PayloadAction<any>) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      },
    );
    //resetDriverPassword
    builder.addCase(resetDriverPassword.pending, state => {
      state.loading = true;
    });
    builder.addCase(
      resetDriverPassword.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.resetDriverPasswordData = action.payload;
      },
    );
    builder.addCase(
      resetDriverPassword.rejected,
      (state, action: PayloadAction<any>) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      },
    );
    //updateDriver
    builder.addCase(updateDriver.pending, state => {
      state.loading = true;
    });
    builder.addCase(
      updateDriver.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.updateDriverData = action.payload;
      },
    );
    builder.addCase(
      updateDriver.rejected,
      (state, action: PayloadAction<any>) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      },
    );
  },
});

export const {showLoading} = DriverSlice.actions;

export default DriverSlice.reducer;

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
  drivers: DataI | [];
  driverDetailsData: DataI | null;
  deleteDriverData: DataI | null;
  resetDriverPasswordData: DataI | null;
  driverOrdersData: DataI | null;
  customerOrdersData: DataI | null;
  assignDriverRes: DataI | null;
  selfAssignDriverRes: DataI | null;
  updateDriverData: DataI | null;
  orderDetailsRes: DataI | null;
  driverRequestActionRes: DataI | null;
  startDeliveryRes: DataI | null;
  completeDeliveryRes: DataI | null;
  driverLocationCoords: DataI | null;
  driverLocationCoordsRes: DataI | null;
}

export const initialState: DriverState = {
  loading: false,
  message: '',
  showMessage: false,
  data: null,
  driverDetailsData: null,
  deleteDriverData: null,
  selfAssignDriverRes: null,
  assignDriverRes: null,
  drivers: [],
  resetDriverPasswordData: null,
  driverOrdersData: null,
  updateDriverData: null,
  driverRequestActionRes: null,
  orderDetailsRes: null,
  startDeliveryRes: null,
  completeDeliveryRes: null,
  customerOrdersData: null,
  driverLocationCoords: null,
  driverLocationCoordsRes: null,
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

export const getDrivers = createAsyncThunk(
  'drivers',
  async (id, {rejectWithValue}) => {
    try {
      const response = await DriverService.drivers();
      return response;
    } catch (err) {
      console.log('drivers', err);
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

export const assignDriver = createAsyncThunk(
  'driver/assignDriver',
  async (data, {rejectWithValue}) => {
    try {
      const response = await DriverService.assignDriver(data);
      return response;
    } catch (err) {
      console.log('driver/assignDriver', err);
      return rejectWithValue(err);
    }
  },
);

export const driverRejected = createAsyncThunk(
  'driver/driverRejected',
  async (data, {rejectWithValue}) => {
    try {
      const response = await DriverService.driverRejected(data);
      return response;
    } catch (err) {
      console.log('driver/driverRejected', err);
      return rejectWithValue(err);
    }
  },
);

export const startDelivery = createAsyncThunk(
  'driver/startDelivery',
  async (data, {rejectWithValue}) => {
    try {
      const response = await DriverService.startDelivery(data);
      return response;
    } catch (err) {
      console.log('driver/startDelivery', err);
      return rejectWithValue(err);
    }
  },
);

export const completeDelivery = createAsyncThunk(
  'driver/completeDelivery',
  async (data, {rejectWithValue}) => {
    try {
      const response = await DriverService.completeDelivery(data);
      return response;
    } catch (err) {
      console.log('driver/completeDelivery', err);
      return rejectWithValue(err);
    }
  },
);

export const assignToSelf = createAsyncThunk(
  'driver/assignToSelf',
  async (data, {rejectWithValue}) => {
    try {
      const response = await DriverService.assignToSelf(data);
      return response;
    } catch (err) {
      console.log('driver/assignToSelf', err);
      return rejectWithValue(err);
    }
  },
);

export const driverOrders = createAsyncThunk(
  'driver/driverOrders',
  async (data, {rejectWithValue}) => {
    try {
      const response = await DriverService.driverOrders(data);
      return response;
    } catch (err) {
      console.log('driver/driverOrders', err);
      return rejectWithValue(err);
    }
  },
);

export const customerOrders = createAsyncThunk(
  'driver/customerOrders',
  async (data, {rejectWithValue}) => {
    try {
      const response = await DriverService.customerOrders(data);
      return response;
    } catch (err) {
      console.log('driver/customerOrders', err);
      return rejectWithValue(err);
    }
  },
);

export const orderDetails = createAsyncThunk(
  'driver/orderDetails',
  async (data, {rejectWithValue}) => {
    try {
      const response = await DriverService.orderDetails(data);
      return response;
    } catch (err) {
      console.log('driver/orderDetails', err);
      return rejectWithValue(err);
    }
  },
);

export const driverAccepted = createAsyncThunk(
  'driver/driverAccepted',
  async (data, {rejectWithValue}) => {
    try {
      const response = await DriverService.driverAccepted(data);
      return response;
    } catch (err) {
      console.log('driver/driverAccepted', err);
      return rejectWithValue(err);
    }
  },
);

export const getDriverLocationCoords = createAsyncThunk(
  'driver/getDriverLocationCoords',
  async (data, {rejectWithValue}) => {
    try {
      const response = await DriverService.getDriverLocationCoords(data);
      return response;
    } catch (err) {
      console.log('driver/getDriverLocationCoords', err);
      return rejectWithValue(err);
    }
  },
);

export const sendDriverLocationCoords = createAsyncThunk(
  'driver/sendDriverLocationCoords',
  async (data, {rejectWithValue}) => {
    try {
      const response = await DriverService.sendDriverLocationCoords(data);
      return response;
    } catch (err) {
      console.log('driver/sendDriverLocationCoords', err);
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
    //Drivers
    builder.addCase(getDrivers.pending, state => {
      state.loading = true;
    });
    builder.addCase(
      getDrivers.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.drivers = action.payload;
      },
    );
    builder.addCase(
      getDrivers.rejected,
      (state, action: PayloadAction<any>) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      },
    );
    //Assign drivers
    builder.addCase(assignDriver.pending, state => {
      state.loading = true;
    });
    builder.addCase(
      assignDriver.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.assignDriverRes = action.payload;
      },
    );
    builder.addCase(
      assignDriver.rejected,
      (state, action: PayloadAction<any>) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      },
    );
    //start delivery
    builder.addCase(startDelivery.pending, state => {
      state.loading = true;
    });
    builder.addCase(
      startDelivery.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.startDeliveryRes = action.payload;
      },
    );
    builder.addCase(
      startDelivery.rejected,
      (state, action: PayloadAction<any>) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      },
    );
    //complete delivery
    builder.addCase(completeDelivery.pending, state => {
      state.loading = true;
    });
    builder.addCase(
      completeDelivery.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.completeDeliveryRes = action.payload;
      },
    );
    builder.addCase(
      completeDelivery.rejected,
      (state, action: PayloadAction<any>) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      },
    );
    //self Assign drivers
    builder.addCase(assignToSelf.pending, state => {
      state.loading = true;
    });
    builder.addCase(
      assignToSelf.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.selfAssignDriverRes = action.payload;
      },
    );
    builder.addCase(
      assignToSelf.rejected,
      (state, action: PayloadAction<any>) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      },
    );
    //driverOrders
    builder.addCase(driverOrders.pending, state => {
      state.loading = true;
    });
    builder.addCase(
      driverOrders.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.driverOrdersData = action.payload;
      },
    );
    builder.addCase(
      driverOrders.rejected,
      (state, action: PayloadAction<any>) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      },
    );

    //customerOrders
    builder.addCase(customerOrders.pending, state => {
      state.loading = true;
    });
    builder.addCase(
      customerOrders.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.customerOrdersData = action.payload;
      },
    );
    builder.addCase(
      customerOrders.rejected,
      (state, action: PayloadAction<any>) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      },
    );

    //driverRequestActionRes
    builder.addCase(driverAccepted.pending, state => {
      state.loading = true;
    });
    builder.addCase(
      driverAccepted.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.driverRequestActionRes = action.payload;
      },
    );
    builder.addCase(
      driverAccepted.rejected,
      (state, action: PayloadAction<any>) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      },
    );

    //getDriverLocationCoords
    builder.addCase(getDriverLocationCoords.pending, state => {
      state.loading = true;
    });
    builder.addCase(
      getDriverLocationCoords.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.driverLocationCoords = action.payload;
      },
    );
    builder.addCase(
      getDriverLocationCoords.rejected,
      (state, action: PayloadAction<any>) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      },
    );

    //sendDriverLocationCoords
    builder.addCase(sendDriverLocationCoords.pending, state => {
      state.loading = true;
    });
    builder.addCase(
      sendDriverLocationCoords.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.driverLocationCoordsRes = action.payload;
      },
    );
    builder.addCase(
      sendDriverLocationCoords.rejected,
      (state, action: PayloadAction<any>) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      },
    );

    //driverRequestActionRes
    builder.addCase(driverRejected.pending, state => {
      state.loading = true;
    });
    builder.addCase(
      driverRejected.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.driverRequestActionRes = action.payload;
      },
    );
    builder.addCase(
      driverRejected.rejected,
      (state, action: PayloadAction<any>) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      },
    );
    //orderDetails
    builder.addCase(orderDetails.pending, state => {
      state.loading = true;
    });
    builder.addCase(
      orderDetails.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.orderDetailsRes = action.payload;
      },
    );
    builder.addCase(
      orderDetails.rejected,
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

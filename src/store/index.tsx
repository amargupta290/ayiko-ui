import {configureStore} from '@reduxjs/toolkit';
import {auth, dashboard, catalog, supplier, cart, driver} from 'store/slices';

export const store = configureStore({
  reducer: {
    auth,
    dashboard,
    catalog,
    supplier,
    cart,
    driver,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

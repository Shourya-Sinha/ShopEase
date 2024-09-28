import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { showSnackbar } from "./InitialSlice";
import { authBaseUrl } from "./AuthSlice";

export const productBaseUrl = 'http://localhost:7000/admin';
export const userBaseUrl = 'http://localhost:7000/user';

const initialState={
    isLoading: false,
    category:[],
    allProduct:[],
    filteredProducts: [],
    singleProduct:null,
    cartData: { items: [] },
    myAddress:[],
    error:false,
    defaultAddressId:null,
    myOrder:[],
    singleOrder:null,
    searchDataFromCategory:[],
}

const slice = createSlice({
    name:'appData',
    initialState,
    reducers:{
      setDefaultAddressId: (state, action) => {
        state.defaultAddressId = action.payload;  // Ensure this payload is being set correctly
      },
      clearCartItems: (state) => {
        state.cartData.items = []; // Simply empty the items array
      },
      setAllProducts: (state, action) => {
        state.allProduct = action.payload;
        state.filteredProducts = action.payload; // Initialize with all products
    },
    filterProducts: (state, action) => {
        const searchTerm = action.payload.toLowerCase();
        state.filteredProducts = state.allProduct.filter(product =>
            product.name.toLowerCase().includes(searchTerm)
        );
    },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCategory.pending, (state) => {
            state.isLoading = true;
            state.error = false;
        }).addCase(fetchCategory.fulfilled, (state, action) => {
            state.isLoading = false;
            state.category = action.payload;
        }).addCase(fetchCategory.rejected, (state) => {
            state.isLoading = false;
            state.error = true;
        }).addCase(fetchAllProduct.pending,(state)=>{
            state.isLoading=true;
            state.error=false;
        }).addCase(fetchAllProduct.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.allProduct=action.payload;
        }).addCase(fetchAllProduct.rejected,(state,action)=>{
            state.isLoading=false;
            state.error=true;
        }).addCase(fetchOneProduct.pending,(state)=>{
            state.isLoading=true;
            state.error=false;
        }).addCase(fetchOneProduct.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.singleProduct=action.payload;
        }).addCase(fetchOneProduct.rejected,(state,action)=>{
            state.isLoading=false;
            state.error=true;
        }).addCase(fetchCartProduct.pending,(state)=>{
            state.isLoading=true;
            state.error=false;
        }) .addCase(fetchCartProduct.fulfilled, (state, action) => {
          state.isLoading = false;
          state.cartData = action.payload;
        }).addCase(fetchCartProduct.rejected,(state)=>{
            state.isLoading=false;
            state.error=true;
        }).addCase(addToProduct.fulfilled, (state, action) => {
            state.cartData = action.payload; // Update the cart state
          })
          .addCase(addToProduct.rejected, (state, action) => {
            state.error = action.payload;
          }).addCase(deleteSingleProFromCart.pending,(state,action)=>{
            state.isLoading=true;
            state.error=false;
          }).addCase(deleteSingleProFromCart.fulfilled, (state, action) => {
            state.isLoading = false;
            // state.cartData = Array.isArray(action.payload) ? action.payload : [];
            state.cartData = action.payload;
          }).addCase(deleteSingleProFromCart.rejected,(state,action)=>{
            state.isLoading=false;
            state.error=action.payload?.message || 'Failed to delete item';
          }).addCase(updateCartItemQuantity.pending,(state)=>{
            state.isLoading=true;
            state.error=false;
          }).addCase(updateCartItemQuantity.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.cartData = action.payload;
          }).addCase(updateCartItemQuantity.rejected,(state)=>{
            state.error=true;
          }).addCase(getMyAddress.fulfilled,(state,action)=>{
            state.isLoading=false;
            // state.myAddress=action.payload;
            state.myAddress = Array.isArray(action.payload) ? action.payload : [];
          }).addCase(getMyAddress.rejected,(state,action)=>{
            state.isLoading=false;
            state.error=true;
          }).addCase(addNewAddress.pending,(state,action)=>{
            state.isLoading=true;
            state.error=false;
          }).addCase(addNewAddress.fulfilled,(state,action)=>{
            state.isLoading=false;
            // state.myAddress=action.payload;
            state.myAddress = [...state.myAddress, action.payload];
          }).addCase(addNewAddress.rejected,(state,action)=>{
            state.isLoading=false;
            state.error=true;
          }).addCase(makeDEfaultAddress.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.defaultAddressId=action.payload._id;
          }).addCase(makeDEfaultAddress.rejected,(state,action)=>{
            state.isLoading=false;
            state.error=true;
          }).addCase(getMyOrder.pending,(state)=>{
            state.isLoading=true;
            state.error=false;
          }).addCase(getMyOrder.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.myOrder=action.payload;
          }).addCase(getMyOrder.rejected,(state,action)=>{
            state.isLoading=false;
            state.error=true;
          }).addCase(fetchSingleOrder.pending,(state,action)=>{
            state.isLoading=true;
            state.error=false;
          }).addCase(fetchSingleOrder.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.singleOrder=action.payload;
          }).addCase(fetchSingleOrder.rejected,(state,action)=>{
            state.isLoading=false;
            state.error=true;
          }).addCase(clearCart.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.cartData.items = [];
          }).addCase(clearCart.rejected,(state)=>{
            state.isLoading=false;
            state.error=true;
          }).addCase(getProductByCategory.pending,(state)=>{
            state.isLoading=true;
            state.error=false;
          }).addCase(getProductByCategory.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.searchDataFromCategory=action.payload;
          }).addCase(getProductByCategory.rejected,(state,action)=>{
            state.isLoading = false;
            state.error = action.error.message;
          })
    }
});
export default slice.reducer;

export const { setDefaultAddressId,clearCartItems,setAllProducts,filterProducts } = slice.actions;

export const getProductByCategory = createAsyncThunk(
  '/getProductByCategory',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(`${productBaseUrl}/getCategoryProduct`, data, {
        timeout: 10000, // 10-second timeout
      });

      // Dispatch a success notification or any other additional actions
      dispatch(showSnackbar({
        severity: 'success',
        message: response.data.message,
      }));

      // Return the product data from the response
      return response.data.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'An error occurred';
      dispatch(showSnackbar({
        severity: 'error',
        message: errorMsg,
      }));
      return rejectWithValue(error.response?.data || { message: errorMsg });
    }
  }
);


export const createOrder=createAsyncThunk('create/order',async(data,{dispatch,rejectWithValue,getState})=>{
  try {
    const token = getState().auth.token;

    const response = await axios.post(`${authBaseUrl}/create-order`,data,{
      headers:{
        Authorization: `Bearer ${token}`,
        // 'Content-Type': 'application/json',
      }
    });

    dispatch(showSnackbar({
      severity:'success',
      message: response.data.message,
    }));
    return response.data.data;
  } catch (error) {
    dispatch(showSnackbar({ severity:error.response?.data?.status, message:error.response?.data?.message }));
    return rejectWithValue( error.response?.data );
  }
})

export const clearCart =createAsyncThunk('/clear-Cart',async(_,{dispatch,rejectWithValue,getState})=>{
  try {
    const token = getState().auth.token;

    const response = await axios.post(`${authBaseUrl}/delete-FullCart`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(showSnackbar({
      severity:'success',
      message: response.data.message,
    }));
     return response.data.data;
  } catch (error) {
    dispatch(showSnackbar({ severity: error.response?.data?.status, message: error.response?.data?.message }));
    return rejectWithValue(error.response?.data);
  }
})
export const makeDEfaultAddress = createAsyncThunk(
  'makeDefault/address',
  async (addressId, { dispatch, rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.put(`${userBaseUrl}/update-status/${addressId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(showSnackbar({
        severity: 'success',
        message: response.data.message,
      }));

      return response.data.data;  // Assuming response.data.data contains updated address info
    } catch (error) {
      dispatch(showSnackbar({
        severity: 'error',
        message: error.response?.data?.message || 'Error setting default address',
      }));
      return rejectWithValue(error.response?.data);
    }
  }
);

export const giveReview = createAsyncThunk('send/review', async (reviewData, { dispatch, rejectWithValue, getState }) => {
  try {
    const token = getState().auth.token;

    const response = await axios.post(`${productBaseUrl}/sendRatings`, reviewData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch(showSnackbar({
      severity: 'success',
      message: response.data.message,
    }));
    return response.data;
  } catch (error) {
    dispatch(showSnackbar({ severity: error.response?.data?.status, message: error.response?.data?.message }));
    return rejectWithValue(error.response?.data);
  }
});

export const fetchSingleOrder=createAsyncThunk('getsingle-order',async(orderId,{dispatch,rejectWithValue,getState})=>{
  try {
    const token = getState().auth.token;

    const response = await axios.get(`${authBaseUrl}/getSingle-order/${orderId}`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(showSnackbar({
      severity:'success',
      message: response.data.message,
    }));
    
    return response.data.data;
  } catch (error) {
    
    dispatch(showSnackbar({ severity:error.response?.data?.status, message:error.response?.data?.message }));
    return rejectWithValue( error.response?.data );
  }
})

export const getMyOrder = createAsyncThunk('/getAll/order',async(_,{dispatch,rejectWithValue,getState})=>{
  try {
    const token = getState().auth.token;

    const response = await axios.get(`${authBaseUrl}/getMy-order`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(showSnackbar({
      severity:'success',
      message: response.data.message,
    }));
    return response.data.data;
  } catch (error) {
    dispatch(showSnackbar({ severity:error.response?.data?.status, message:error.response?.data?.message }));
    return rejectWithValue( error.response?.data );
  }
})

export const addNewAddress = createAsyncThunk('addnew-address',async(data,{dispatch,rejectWithValue,getState})=>{
  try {
    const token = getState().auth.token;

    const response = await axios.post(
      `${userBaseUrl}/add-address`,
      data, // This should be the request body
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    dispatch(showSnackbar({
      severity: 'success',
      message: response.data.message,
    }));
    return response.data.data || [];
  } catch (error) {
    dispatch(showSnackbar({ severity:error.response?.data?.status, message:error.response?.data?.message }));

        return rejectWithValue( error.response?.data );
  }
})

export const getMyAddress=createAsyncThunk('get-all-address',async(_,{dispatch,rejectWithValue,getState})=>{
  try {
    const token = getState().auth.token;

    const response = await axios.get(`${userBaseUrl}/getall-address`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    dispatch(showSnackbar({ severity:error.response?.data?.status, message:error.response?.data?.message }));
    return rejectWithValue( error.response?.data );
  }
})

export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateCartItemQuantity',
  async ({ newQuantity, selectedColour, selectedVariant, productId }, { dispatch, rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      
      if (!token) {
        return rejectWithValue({
          status: 'error',
          message: 'Authorization token is missing',
        });
      }

      const response = await axios.post(
        `${authBaseUrl}/updateQyantity-Cart`,
        {
          requestedQuantity:newQuantity,
          selectedColorId:selectedColour,
          selectedVariantName:selectedVariant,
          productId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(
        showSnackbar({
          severity: 'success',
          message: response.data.message,
        })
      );
      return response.data.cart;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Something went wrong';

      dispatch(
        showSnackbar({
          severity: 'error',
          message: errorMessage,
        })
      );

      return rejectWithValue(error.response?.data);
    }
  }
);

export const deleteSingleProFromCart = createAsyncThunk(
  '/delete-single-cart',
  async ({ productId, selectedColour, selectedVariant }, { dispatch, rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.delete(`${authBaseUrl}/deleteItemon-Cart`, {
        data: { productId, selectedColour, selectedVariant },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      dispatch(showSnackbar({
        severity: response.data.status,
        message: response.data.message,
      }));

      // Return the updated cart object
      return response.data.data;
    } catch (error) {
      dispatch(showSnackbar({ severity: error.response?.data?.status, message: error.response?.data?.message }));
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchCartProduct = createAsyncThunk(
  '/getA-Cart-Product',
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(`${authBaseUrl}/getCart-data`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = response.data.data;

      // Return the entire cart object
      return data;
    } catch (error) {
      dispatch(showSnackbar({
        severity: error.response?.data?.status,
        message: error.response?.data?.message,
      }));
      return rejectWithValue(error.response?.data);
    }
  }
);

export const addToProduct = createAsyncThunk(
  'cart/addToCart',
  async (cartItem, { dispatch, rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.post(
        `${authBaseUrl}/add-to-cart`,
        cartItem,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status !== 'success') {
        throw new Error('Failed to add item to cart');
      }

      dispatch(showSnackbar({
        severity: 'success',
        message: response.data.message,
      }));

      return response.data.data;
    } catch (error) {
      console.error("Add to cart error:", error.response || error.message);
      dispatch(showSnackbar({
        severity: 'error',
        message: error.response?.data?.message || 'Error adding to cart',
      }));
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchOneProduct = createAsyncThunk(
    "/find-A-Product",
    async (productId, { dispatch, rejectWithValue }) => {
      try {
        const response = await axios.get(`${productBaseUrl}/geta-product/${productId}`);
        dispatch(showSnackbar({
            severity:response.data.status,
            message: response.data.message,
        }));
        return response.data.data; // Return the fetched data
      } catch (error) {
        dispatch(
          showSnackbar({ 
            severity: error.response?.data?.status, 
            message: error.response?.data?.message 
          })
        );
        return rejectWithValue(error.response?.data);
      }
    }
  );

export const fetchAllProduct = createAsyncThunk('/getAllProduct',async(_,{dispatch,rejectWithValue})=>{
    try {
        const response = await axios.get(`${productBaseUrl}/getAll-product`);
        return response.data.data;
    } catch (error) {
        dispatch(showSnackbar({ severity:error.response?.data?.status, message:error.response?.data?.message }));

        return rejectWithValue( error.response?.data );
    }
});

export const fetchCategory= createAsyncThunk( '/getall-category', async(_, {dispatch,rejectWithValue})=>{
    try {
        const response = await axios.get(`${productBaseUrl}/getAll-category`);

        // dispatch(showSnackbar({
        //     severity:response.data.status,
        //     message: response.data.message,
        // }));

        return response.data.data;
    } catch (error) {
        dispatch(showSnackbar({ severity:error.response?.data?.status, message:error.response?.data?.message }));

        return rejectWithValue( error.response?.data );
    }
});
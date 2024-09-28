import { createSlice } from "@reduxjs/toolkit";

const initialState={
    isLoggedIn: false,
    snackbar:{
        open:null,
        severity:null,
        message:null,
    }
};

const slice = createSlice({
    name:'app',
    initialState,
    reducers:{
        openSnackBar(state,action){
            state.snackbar.open=true;
            state.snackbar.severity=action.payload.severity;
            state.snackbar.message=action.payload.message;
        },
        closeSnackBar(state){
            state.snackbar.open=false;
            state.snackbar.message=null;
        }
    }
});

export default slice.reducer;

export const closeSnackbar = () => async (dispatch, getState) => {
    dispatch(slice.actions.closeSnackBar());
};

export const showSnackbar = ({ severity, message }) => async (dispatch, getState) => {
    dispatch(slice.actions.openSnackBar({ message, severity }));

    setTimeout(() => {
        dispatch(slice.actions.closeSnackBar());  // Ensure parentheses are present
    }, 4000);
};

// export const showSnackbar =
//     ({ severity, message }) =>
//     async (dispatch, getState) => {
//         // Dispatch openSnackBar with the message and severity
//         dispatch(
//             slice.actions.openSnackBar({
//                 message,
//                 severity,
//             })
//         );

//         // Close the snackbar after 4 seconds
//         setTimeout(() => {
//             dispatch(slice.actions.closeSnackBar()); // Add parentheses here to call the action
//         }, 4000);
//     };

// export const showSnackbar = 
//      ({severity,message})=>
//          async (dispatch,getState)=>{
//             dispatch(
//                 slice.actions.openSnackBar({
//                     message,
//                     severity,
//                 })
//             );
//             setTimeout(()=>{
//                 dispatch(slice.actions.closeSnackBar());
//             },4000);
//          };
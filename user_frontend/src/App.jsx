import './App.css'
import { Box, Snackbar, Typography } from '@mui/material'
import AppRoute from './Pages/AppRoute'
import ScrollyButton from './Components/ScrollyButton'
import React, { useEffect, useState } from "react";
import MuiAlert from '@mui/material/Alert';
import { useDispatch, useSelector } from 'react-redux';
import { closeSnackbar } from './Redux/Slices/InitialSlice';
const vertical = 'bottom';
const horizontal = 'left';

const Alert = React.forwardRef(function Alert(props,ref){
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
});

function App() {
  const [isScreenAllowed, setIsScreenAllowed] = useState(true);
  const dispatch = useDispatch();

  const {severity,message,open} = useSelector(
    (state) => state.app.snackbar,
  )

  useEffect(() => {
    // Helper function to check if the screen width is allowed
    const isScreenWidthAllowed = () => {
      const devicePixelRatio = window.devicePixelRatio || 1;
      const widthInPixels = window.innerWidth; // Get the current width of the browser window in pixels
      const widthInInches = widthInPixels / (96 * devicePixelRatio); // Convert pixels to inches

      if (widthInInches < 8) {
        setIsScreenAllowed(false); // Disallow screen if width is less than 5 inches
      } else {
        setIsScreenAllowed(true); // Allow screen otherwise
      }
    };

    isScreenWidthAllowed(); // Initial check

    // Add event listener for resize events to dynamically check the width
    window.addEventListener("resize", isScreenWidthAllowed);
    return () => window.removeEventListener("resize", isScreenWidthAllowed);
  }, []);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(closeSnackbar());  // This should dispatch the action properly
  };
  return (
    <>
       <Box>
        {isScreenAllowed ? (
          <div>
            <AppRoute />
            <ScrollyButton />
          </div>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
              backgroundColor: '#ffe0e0',
              padding: 2,
            }}
          >
            {/* Weeping Emoji */}
            <Typography
              variant="h1"
              sx={{ fontSize: 150, color: '#ff5e57', marginBottom: 2 }}
            >
              😢
            </Typography>

            {/* Message Text */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 500,
                fontSize: 20,
                color: '#333',
                textAlign: 'center',
                paddingX: 2,
                border: '2px dashed #ff5e57',
                borderRadius: 2,
                backgroundColor: '#fff0f0',
                padding: 2,
              }}
            >
              Please open this website on a laptop or a computer for the best
              experience.
            </Typography>
          </Box>
        )}
      </Box>
      {message && open && (
        <Snackbar anchorOrigin={{vertical,horizontal}} open={open} autoHideDuration={4000} onClose={handleClose} >
          <Alert onClose={handleClose} severity={severity} sx={{width:'100%'}}>{message} </Alert>
        </Snackbar>
      )}
    </>
  )
}

export default App;

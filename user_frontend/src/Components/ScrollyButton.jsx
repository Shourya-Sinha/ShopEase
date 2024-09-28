import { KeyboardArrowUp } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import React, { useEffect, useState } from 'react'

const ScrollyButton = () => {
    const [isVisible,setIsVisible] = useState(false);

    const handleScroll=()=>{
        if(window.scrollY > 300){
            setIsVisible(true);
        }else{
            setIsVisible(false);
        }
    };
    const scrollToTop=()=>{
        window.scrollTo({
            top:-100,
            behavior:'smooth'
        });
    };

    useEffect(()=>{
        window.addEventListener('scroll', handleScroll);
        return ()=>{
            window.removeEventListener('scroll',handleScroll);
        }
    },[]);
  return (
    <>
       <Box>
      {isVisible && (
        <Button
          onClick={scrollToTop}
          variant="contained"
          color="primary"
          sx={{
            borderRadius: '50%',
            position: 'fixed', // Fixed positioning relative to the viewport
            top: '95vh', // Distance from the bottom of the viewport
            right: 20, // Distance from the right of the viewport
            width: 56, // Width of the circular button
            height: 56, // Height of the circular button
            minWidth: 'auto',
            backgroundColor: 'salmon', // Background color
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000, // Ensure the button is above other elements
            '&:hover': {
              backgroundColor: '#FF7F7F', // Hover color
            },
          }}
        >
          <KeyboardArrowUp />
        </Button>
      )}
    </Box>
    </>
  )
}

export default ScrollyButton;
import { Box } from "@mui/material";
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import HeaderFirst from "./HeaderFirst";

const BaseLayout = ({ children }) => {
  return (
    <Box sx={{display:'flex',flexDirection:'column', height: '100vh' }}>
      <Box component={'header'} sx={{width:'100%'}}>
        <HeaderFirst />
      </Box>
      <header  style={{ width: '100%', top: 0, zIndex: 1000 }}>
        <Header />
      </header>
      <Box component="main" sx={{pt: '50px' }}>
        {children}
      </Box>

      <Box component={'footer'} >
      <Footer />
      </Box>
    </Box>
  );
};

export default BaseLayout;

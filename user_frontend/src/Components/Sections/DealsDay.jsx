import { Box, Container, Grid2, Typography } from "@mui/material";
import React, { useEffect } from "react";
import DealsProduct from "../DealsProduct";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProduct } from "../../Redux/Slices/ProductSlice";

const gradientHeadingStyle = {
  fontSize: "1.5rem", // Adjust as needed
  fontWeight: 700,
  fontFamily: "Alegreya",
  background: "linear-gradient(135deg, #f5a623, #f76b1c, #ff0099, #493240)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent", // Makes the text color transparent to show the gradient
  display: "inline-block", // Change to inline-block to handle pseudo-elements properly
  position: "relative",
  paddingTop: 6,
};

const DealsDay = () => {
  const dispatch = useDispatch();
  const AllProduct = useSelector((state)=>state.appData.allProduct || []);

  useEffect(() => {
    if (AllProduct.length === 0) {  // Fetch only if products array is empty
      dispatch(fetchAllProduct());
    }
  }, [dispatch, AllProduct.length]);

  const slicesProduct = AllProduct.slice(0, 2)
  return (
    <>
      <Container minwidth="lg">
        <Box position="relative" display="inline-block">
          <Typography sx={gradientHeadingStyle}>Deals of The Day</Typography>
          <svg
            width="100%"
            height="6" // Adjust height to your liking
            style={{ position: "absolute", bottom: "2px", left: 22 }}
          >
            <defs>
              <clipPath id="zigzag-clip">
                <path d="M10,10 L220,10 L30,0 L30,10 L50,10 L150,10 L30,0 L50,10 L40,0 L30,10 L50,0 V10 H0 Z" />
              </clipPath>
            </defs>
            <rect
              width="100%"
              height="10" // Adjust height to match the zigzag path
              fill="url(#gradient)"
              clipPath="url(#zigzag-clip)"
            />
            <defs>
              {/* Define the gradient for the fill */}
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop
                  offset="0%"
                  style={{ stopColor: "#f5a623", stopOpacity: 1 }}
                />
                <stop
                  offset="33%"
                  style={{ stopColor: "#f76b1c", stopOpacity: 1 }}
                />
                <stop
                  offset="66%"
                  style={{ stopColor: "#ff0099", stopOpacity: 1 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: "#493240", stopOpacity: 1 }}
                />
              </linearGradient>
            </defs>
          </svg>
        </Box>

        <Box sx={{ marginTop: 2 }}>
              <DealsProduct products={slicesProduct} />
        </Box>
      </Container>
    </>
  );
};

export default DealsDay;

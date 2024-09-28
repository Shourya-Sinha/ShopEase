import { Box, Container, Grid2, Typography } from '@mui/material';
import React from 'react';
import ProductCard from '../ProductCard';

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

const NewProducts = () => {
  return (
    <>
    <Container maxWidth="lg">
    <Box position="relative" display="inline-block">
          <Typography sx={gradientHeadingStyle}>Our Top Products</Typography>
          <svg
            width="100%"
            height="6" // Adjust height to your liking
            style={{ position: "absolute", bottom: "2px", left: 36 }}
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

        <Box paddingTop={4}>
            <ProductCard />
        </Box>
    </Container>
    </>
  )
}

export default NewProducts;
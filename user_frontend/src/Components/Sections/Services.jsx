import { Box, Button, Container, Grid2, Popover, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import "../../Layout/HeaderStyle.css";
import {
  Build,
  LocalShipping,
  Stars,
  SupportAgent,
  ThumbUpAlt,
} from "@mui/icons-material";
import { Repeat, ShieldCheck } from "phosphor-react";

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

const gradientIconStyle = {
    fontSize: 30, // Adjust icon size as needed
    background: "linear-gradient(135deg, #f5a623, #f76b1c, #ff0099, #493240)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent", // Makes text color transparent to show gradient
    // color:'linear-gradient(135deg, #f5a623, #f76b1c, #ff0099, #493240)'
    color:'#f76b1c'
  };
const serviceContent = [
  { title: "Warrenty Care", icon: <ShieldCheck style={gradientIconStyle} /> },
  { title: "Customer Support", icon: <SupportAgent sx={gradientIconStyle} /> },
  { title: "Quality Assurance", icon: <ThumbUpAlt sx={gradientIconStyle} /> },
  { title: "Repair and Maintenance", icon: <Build sx={gradientIconStyle} /> },
  { title: "Fast Delivery", icon: <LocalShipping sx={gradientIconStyle} /> },
  { title: "Top Brands", icon: <Stars sx={gradientIconStyle} /> },
];

const Services = () => {

  return (
    <>
      <Container maxWidth="lg">
        <Box position="relative" display="inline-block">
          <Typography sx={gradientHeadingStyle}>Our Services</Typography>
          <svg
            width="100%"
            height="6" // Adjust height to your liking
            style={{ position: "absolute", bottom: "2px", left: 0 }}
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
        <Box sx={{marginTop:3}}>
          <Grid2 container spacing={2}>
            {serviceContent.map((content, index) => (
              <Grid2 size={{ xs: 12, md: 3, xl: 2, lg: 2, sm: 4 }} key={index}>
                <Stack
                  sx={{
                    justifyContent: "center",
                  }}
                  spacing={1}
                >
                  <Box
                    sx={{
                      mb: 1.5,
                      display: "flex",
                      justifyContent: "center",
                      fontSize: 60,
                    }}
                  >
                    {content.icon}
                  </Box>
                  <Typography
                    sx={{
                      fontSize: 11,
                      fontFamily: "Roboto",
                      textAlign: "center",
                      color:'#245000'
                    }}
                  >
                    {content.title}
                  </Typography>
                </Stack>
              </Grid2>
            ))}
          </Grid2>
        </Box>
      </Container>
    </>
  );
};

export default Services;

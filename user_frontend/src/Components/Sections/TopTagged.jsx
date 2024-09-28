import { Box, Container, Divider, Grid2, Typography } from "@mui/material";
import React, { useEffect } from "react";
import TagProductComp from "../TagProductComp";
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
  paddingTop: 5,
};

const TopTagged = () => {
  const dispatch = useDispatch();
  const AllProduct = useSelector((state) => state.appData.allProduct || []);

  useEffect(() => {
    if (AllProduct.length === 0) {
      // Fetch only if products array is empty
      dispatch(fetchAllProduct());
    }
  }, [dispatch, AllProduct.length]);

  const slicesProduct = AllProduct.slice(0, 6);

  return (
    <>
      <Container minwidth="lg">
        <Box position="relative" display="inline-block">
          <Typography sx={gradientHeadingStyle}>Top Tagged Products</Typography>
          <svg
            width="100%"
            height="6" // Adjust height to your liking
            style={{ position: "absolute", bottom: "2px", left: 70 }}
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

        {/* Your other components */}
        <Box marginTop={3}>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, md: 4, xl: 4, lg: 4 }}>
              <Box sx={{ width: "100%" }}>
                <Typography
                  sx={{
                    fontSize: 25,
                    fontWeight: 500,
                    fontFamily: "Roboto",
                    paddingLeft: 1,
                  }}
                >
                  New Arrivals
                </Typography>
                <Divider />
              </Box>

              <TagProductComp products={slicesProduct} />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4, xl: 4, lg: 4 }}>
              <Box sx={{ width: "100%" }}>
                <Typography
                  sx={{
                    fontSize: 25,
                    fontWeight: 500,
                    fontFamily: "Roboto",
                    paddingLeft: 1,
                  }}
                >
                  Trending
                </Typography>
                <Divider />
              </Box>

              <TagProductComp products={slicesProduct} />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4, xl: 4, lg: 4 }}>
              <Box sx={{ width: "100%" }}>
                <Typography
                  sx={{
                    fontSize: 25,
                    fontWeight: 500,
                    fontFamily: "Roboto",
                    paddingLeft: 1,
                  }}
                >
                  Top Rated
                </Typography>
                <Divider />
              </Box>

              <TagProductComp products={slicesProduct} />
            </Grid2>
          </Grid2>
        </Box>
      </Container>
    </>
  );
};

export default TopTagged;

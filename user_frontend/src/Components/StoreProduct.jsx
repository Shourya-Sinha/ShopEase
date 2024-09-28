import { Box, Button, Grid2, Stack, Typography } from "@mui/material";
import React from "react";
import Image from "../assets/Images/iqoo1.png";
import ReactStars from "react-stars";
import { Link } from "react-router-dom";

const MyProduct = ({ size ,product}) => {
  const variant = product?.colors[0].variants?.[0];
  const varinatName = product?.colors[0]?.variants?.[0]?.name;
  return (
    <>
      {size === 6 ? (
        <Box sx={{ backgroundColor: "#fff", borderRadius: 2 }}>
          <Grid2 container>
            <Grid2 size={{ xs: 5, md: 5, backgroundColor: "#fff" }}>
            {product?.colors[0]?.images?.length > 0 && (
 <Box>
 <img
   // src={product.images[0].url}
   src={product.colors[0].images[0].secure_url}
   alt="Product Image"
   style={{ width: 200, height: 220, objectFit: "contain" }}
 />
</Box>  
 )}   
            </Grid2>
            <Grid2 size={{ xs: 7, md: 7 }}>
              <Stack spacing={1} paddingX={1} paddingTop={3}>
                <ReactStars
                  count={5}
                  //   onChange={ratingChanged}
                  size={20}
                  color={"#254000"}
                />
                <Typography
                  variant="subtitle2"
                  sx={{ textTransform: "capitalize", fontWeight: 500 ,  whiteSpace: "nowrap", // Prevents text from wrapping
                    overflow: "hidden", // Hides overflow text
                    textOverflow: "ellipsis",}}
                >
                 {product.name}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ color: "#ff5722", fontWeight: 700 }}
                >
                 &#8377;{variant ? `${variant.price}.00` : "Price not available"}
                </Typography>
                <Typography variant="body2" paddingBottom={2}>
                {varinatName}
                </Typography>
                <Stack paddingTop={1} sx={{border:'1px solid salmon',justifyContent:'center',alignItems:'center',borderRadius:2}}>
                <Link to={`/product/${product._id}`} style={{textDecoration:'none',fontFamily:'Roboto',fontWeight:500}}>
                {" "}
                View Details
              </Link>
                </Stack>
              </Stack>
            </Grid2>
          </Grid2>
        </Box>
      ) : (
        <Box
          sx={{
            border: "1px solid #f0f0f0",
            backgroundColor: "#fff",
            borderRadius: 2,
            padding: 1,
          }}
        >
           {product?.colors[0]?.images?.length > 0 && (
        <Stack sx={{ justifyContent: "center", alignItems: "center" }} display={"column"}>
          <img
            src={product.colors[0].images[0].secure_url}  // Display only the first image
            alt="Product Color Image"
            style={{ width: 200, height: 220, objectFit: "contain" }}
          />
        </Stack>
      )}

          <Stack spacing={1} paddingX={1}>
            <ReactStars
              count={5}
              value={product.averageRating || 0}
              size={20}
              edit={false}
              color={"#254000"}
            />
            <Typography
              variant="subtitle2"
              sx={{ textTransform: "capitalize", fontWeight: 500 ,  whiteSpace: "nowrap", // Prevents text from wrapping
                overflow: "hidden", // Hides overflow text
                textOverflow: "ellipsis",}}
            >
             {product.name}
            </Typography>
            <Typography variant="h5" sx={{ color: "#ff5722", fontWeight: 700 }}>
            &#8377;{variant ? `${variant.price}.00` : "Price not available"}
            </Typography>
            <Typography variant="body2" paddingBottom={2} flexWrap={"wrap"}>
            {varinatName}
            </Typography>
            <Box sx={{border:'1px solid salmon',justifyContent:'center',alignItems:'center',borderRadius:2,display:'flex',paddingY:0.5}}>
            <Link to={`/product/${product._id}`} style={{textDecoration:'none',fontFamily:'Roboto',fontWeight:500}}>
                {" "}
                View Details
              </Link>
            </Box>
          </Stack>
        </Box>
      )}
    </>
  );
};

const StoreProduct = ({ size,products }) => {
  return (
    <Grid2 container spacing={1}>
       {products.map((product) => (
        <Grid2 key={product._id} size={{ xs: size, md: size, lg: size }}>
          <MyProduct size={size} product={product} />
        </Grid2>
      ))}
    </Grid2>
  );
};

export default StoreProduct;

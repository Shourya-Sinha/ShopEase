import React, { useEffect } from "react";
import SecondImage from "../assets/Images/iqoo2.png";
import {
  Box,
  Grid2,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { Favorite, ShoppingCart, Visibility } from "@mui/icons-material";
import { Link } from "react-router-dom";

const TagProductComp = ({ products }) => {
  if (!Array.isArray(products) || products.length === 0) {
    return <Typography>No products available</Typography>;
  }

  const truncateWords =(name,maxWords=10)=>{
    const words = name.split(" ");
    return words.length > maxWords ? words.slice(0,maxWords).join(" ") + "..." : name;
  }
  return (
    <>
    {products.map((product)=>(
      <Box
      key={product._id}
      sx={{
         position: "relative",
         border: "1px solid #d9d9d9",
         borderRadius: 3,
         marginTop: 3,
         overflow: 'hidden', // Clips the hoverIcons within the Box
         "&:hover": {
           boxShadow: "5px 10px 20px rgba(0,0,0,0.3)"
         },
         "&:hover .hoverIcons": {
           bottom: 0, // Moves icons into view on hover
         },
       }}
   >
     <Grid2 container>
       <Grid2 size={{ xs: 4, md: 4 }}>
         <Box
           sx={{
             padding: 2,
             display: "flex",
             justifyContent: "center",
             alignItems: "center",
           }}
         >
           <img
             src={product.colors?.[0]?.images?.[0]?.secure_url || 'nopthing'}
             alt="Product Image"
             style={{ width: "80px", height: "80px", objectFit: "contain" }}
           />
         </Box>
       </Grid2>
       <Grid2 size={{ xs: 8, md: 8 }}>
         <Box sx={{ padding: 2 }}>
           <Stack spacing={1}>
             <Typography
               sx={{
                 fontSize: 15,
                 fontWeight: 500,
                 fontFamily: "Roboto",
                 color: "#434343",
               }}
             >
               {truncateWords(product.name)}
             </Typography>
             <Typography
               sx={{
                 fontSize: 11,
                 fontWeight: 500,
                 fontFamily: "Roboto",
                 color: "#595959",
               }}
             >
               {product.category.subCategory}
             </Typography>
             <Stack direction={"row"} spacing={1} alignItems={"center"}>
               <Typography
                 color="#FF8F9C"
                 sx={{ fontSize: "0.875rem", fontWeight: 700 }}
               >
                 &#8377; {product.colors?.[0]?.variants?.[0]?.price}
               </Typography>
               <Typography
                 color="#B9B2AE"
                 sx={{ textDecoration: "line-through", fontSize: "0.75rem" }}
               >
                 &#8377; 812.92
               </Typography>
             </Stack>
           </Stack>
           <Paper
     className="hoverIcons"
     sx={{
       position: "absolute",
       bottom: "-60px", // Initially hidden below the parent box
       left: "50%",
       transform: "translateX(-50%)",
       display: "flex",
       flexDirection: "row",
       transition: "bottom 0.3s ease-in-out", // Smooth transition effect
     }}
   >
     <Stack direction={'row'} spacing={1}>
     <Tooltip title="Add To Cart" placement="top-start" arrow>
       <IconButton
         color="primary"
         size="small"
         sx={{ boxShadow: "none" }}
       >
         <ShoppingCart />
       </IconButton>
     </Tooltip>
     <Tooltip title="Add To Wishlist" placement="top-start" arrow>
       <IconButton
         color="primary"
         size="small"
         sx={{ boxShadow: "none" }}
       >
         <Favorite />
       </IconButton>
     </Tooltip>
     <Tooltip title="Quick View" placement="top-start" arrow>
       <Link to={`/product/${product._id}`}>
       <IconButton
         color="primary"
         size="small"
         sx={{ boxShadow: "none" }}
       >
         <Visibility />
       </IconButton>
       </Link>
      
     </Tooltip>
     </Stack>

   </Paper>
         </Box>
       </Grid2>
     </Grid2>
   </Box>
    ))}

    </>
  );
};

export default TagProductComp;

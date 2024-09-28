import {
  Box,
  Divider,
  Grid2,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import FirstImage from "../assets/Images/iqoo1.png";
import SecondImage from "../assets/Images/iqoo2.png";
import ThirdImage from "../assets/Images/iqoo12sec.webp";
import ReactStars from "react-stars";
import { Favorite, ShoppingCart, Visibility } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProduct } from "../Redux/Slices/ProductSlice";

const ProductCard = () => {
  const dispatch = useDispatch();
  const AllProduct = useSelector((state)=>state.appData.allProduct || []);
  const filterdProducts = useSelector((state)=>state.appData.filteredProducts ||[]);

  useEffect(() => {
    dispatch(fetchAllProduct());
  }, [dispatch]);

  
  const slicesProduct = (filterdProducts.length > 0 
    ? filterdProducts 
    : AllProduct
  ).slice(0, 12);
  const truncateWords =(name,maxWords=3)=>{
    const words = name.split(" ");
    return words.length > maxWords ? words.slice(0,maxWords).join(" ") + "..." : name;
  }
  return (
    <>
    <Grid2 container spacing={1.8}>
    {slicesProduct.map((product,index)=> (
      <Grid2 size={{xs:12,md:3,xl:2,lg:2}} key={product._id}>
      <Box
      sx={{
        position: "relative", // To position the icon container absolutely within this box
        borderRadius: 2,
        overflow: "hidden", // Clips the icons within the box boundary
        boxShadow: "none", // Initial state without shadow
        padding:2,
  transition: "box-shadow 0.3s ease-in-out", // Smooth transition for shadow effect
  "&:hover": {
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)", // Box shadow on hover
  },
        "&:hover .hoverIcons": {
          right: -1, // Moves icons into view on hover
        },
      }}
    >
     <Box>
      <Typography
      className="customAngle"
        sx={{
          color: "#fff",
          fontSize: 10,
          fontWeight: "bold",
          letterSpacing: 1,
          backgroundColor:'#f5222d',
          top:10,
          position: "absolute",
        }}
      >
        {product.tags || 'HOT'}
      </Typography>
    </Box>
      <Box
        sx={{
          backgroundColor: "#d9d9d9",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 3,
padding:2
        }}
      >
        <img
          src={product.colors?.[0]?.images?.[0]?.secure_url || 'nothing'}
          alt="Phone Number 1"
          width={"130px"}
          height={"140px"}
          style={{ objectFit: "contain" }}
        />
      </Box>
      <Paper
        className="hoverIcons"
        sx={{
          position: "absolute",
          paddingTop: 4,
          top: "40%",
          right: "-50px", // Initially hidden to the left
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          transition: "right 0.3s ease-in-out", // Smooth transition effect
        }}
      >
        <Tooltip title="Add To Cart" placement="left-start" arrow>
          <IconButton color="primary" size="small" sx={{ boxShadow: "none" }}>
            <ShoppingCart />
          </IconButton>
        </Tooltip>
        <Tooltip title="Add To Wishlist" placement="left-start" arrow>
          <IconButton color="primary" size="small" sx={{ boxShadow: "none",paddingBottom:'0px !important' }}>
            <Favorite />
          </IconButton>
        </Tooltip>
        <Tooltip title="Quick View" placement="left-start" arrow>
          <Link to={`/product/${product._id}`} style={{textDecoration:'none',paddingTop:0,paddingLeft:4 }}>
            <Visibility />
          </Link>
        </Tooltip>
      </Paper>
      {/* Product detaiuls */}
      <Stack spacing={0.2} paddingX={1} paddingTop={1}>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 500,
              color: "##434343",
              fontFamily: "Roboto",
            }}
          >
            {truncateWords(product.name)}
          </Typography>
          <Stack direction={"row"}>
            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 400,
                color:'#FF8F9C',
                fontFamily: "Roboto",
              }}
            >
              &#8377;
            </Typography>
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 400,
                color:'#FF8F9C',
                fontFamily: "Roboto",
              }}
            >
              {product.colors?.[0]?.variants?.[0]?.price}.
            </Typography>
            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 400,
                color:'#FF8F9C',
                fontFamily: "Roboto",
              }}
            >
              00
            </Typography>
          </Stack>
        </Stack>
        <Stack direction={"row"} alignItems={"center"} spacing={1}>
          <ReactStars
            value={product.averageRating || 0}
            size={20}
            readOnly
            edit={false}
            color={"#254000"}
          />
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 400,
              color:'#FF8F9C',
              fontFamily: "Roboto",
            }}
          >
            {product.totalRatings === 0 ? '(0)' : `(${product.totalRatings})`}
          </Typography>
        </Stack>
      </Stack>
    </Box>
    </Grid2>
    ))}
</Grid2>
    </>
  );
};

export default ProductCard;

import {
  Box,
  Button,
  Container,
  Grid2 as Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import firstImage from "../assets/Images/iqoo1.png";
import {
  Add,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Delete,
  Favorite,
  Remove,
  StarTwoTone,
} from "@mui/icons-material";
import { Link, Navigate } from "react-router-dom";
import BreadCrimbs from "../Components/BreadCrimbs";
import MyLogo from "../assets/Images/dell.png";
import { useDispatch, useSelector } from "react-redux";
import { deleteSingleProFromCart, fetchCartProduct, updateCartItemQuantity } from "../Redux/Slices/ProductSlice";

const Cart = () => {
  const truncateText = (text, maxWords) => {
    // Check if 'text' exists and is a string
    if (typeof text !== 'string') {
      return ''; // Return an empty string if 'text' is undefined or not a string
    }
  
    // Split the text into words
    const words = text.split(" ");
  
    // If the number of words exceeds maxWords, truncate the text
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(" ") + "...";
    }
  
    // If no truncation is needed, return the original text
    return text;
  };

  const [quantity, setQuantity] = useState(1);
  const cartData = useSelector((state) => state.appData.cartData || { items: [] });
  const {isLoading,error} = useSelector((state)=> state.appData);
  const dispatch = useDispatch();

  const items = cartData.items || [];

  const handleIncrease = (itemId, selectedColour, selectedVariant) => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    dispatch(updateCartItemQuantity({
      productId: itemId,
      selectedColour: selectedColour._id,
      selectedVariant,
      newQuantity
    }));
  };

  const handleDecrease = (itemId, selectedColour, selectedVariant) => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      dispatch(updateCartItemQuantity({
        productId: itemId,
        selectedColour,
        selectedVariant,
        newQuantity
      }));
    }
  };

  useEffect(()=>{
    dispatch(fetchCartProduct());
  },[dispatch])

  const handleItemsDelete = (productId, selectedColour, selectedVariant) => {
    dispatch(deleteSingleProFromCart({ 
      productId, 
      selectedColour: selectedColour._id, // Ensure this matches what the backend expects
      selectedVariant 
    }));
  };

  if (isLoading) {
    return (
      <Container>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: "#F5F5F5",
          }}
        >
          <Box sx={{ fontSize: 24, color: "#254000" }}>
            <Typography sx={{ fontSize: '8rem' }}>🕒</Typography>
            <Typography variant="h6" align="center" sx={{ marginTop: 5 }}>
              Loading cart data...
            </Typography>
          </Box>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: "#F5F5F5",
          }}
        >
          <Box sx={{ fontSize: 24, color: "#254000" }}>
            <Typography sx={{ fontSize: '8rem' }}>❌</Typography>
            <Typography variant="h6" align="center" sx={{ marginTop: 5 }}>
              Error loading cart data..: {error.message}
            </Typography>
          </Box>
        </Box>
      </Container>
    );
  }

if (items.length === 0) {
  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#F5F5F5",
        }}
      >
        <Box sx={{ fontSize: 24, color: "#254000" }}>
          <Typography sx={{ fontSize: '8rem' }}>🥺</Typography>
          <Typography variant="h6" align="center" sx={{ marginTop: 5 }}>
            Your cart is empty!
          </Typography>
          <Link to={'/'}>Go to Shopping</Link>
        </Box>
      </Box>
    </Container>
  );
}
const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);
  return (
    <>
<Container maxWidth="lg">
        <Box>
          <Typography sx={{ fontWeight: 700, color: "#254000", fontSize: "2rem", marginTop: 6, paddingBottom: 5 }}>
            Shopping Bag
          </Typography>
          <BreadCrimbs />
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 8 }}>
              {items.map((item) => (
                <Grid container spacing={2} sx={{ border: "1px solid salmon", borderRadius: 3, marginBottom: 1 }} key={item._id}>
                  <Grid size={{ xs: 12, md: 4 }} sx={{ padding: 2 }}>
                    <Box sx={{ borderRadius: 3, display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                      <img
                        src={item.product?.colors?.[0]?.images?.[0]?.secure_url || ''}
                        alt="Product"
                        style={{ width: "100%", height: "auto", maxHeight: "230px", objectFit: "contain", padding: 5, borderRadius: 15 }}
                      />
                    </Box>
                  </Grid>
                  <Grid size={"grow"}>
                    <Box sx={{ position: 'relative', top: '35px', display: 'flex', justifyContent: 'flex-end', right: '20px' }}>
                      <IconButton onClick={() => handleItemsDelete(item.product._id, item.selectedColour, item.selectedVariant)}>
                        <Delete />
                      </IconButton>
                    </Box>
                    <Stack spacing={0.4} sx={{ paddingTop: 2, padding: 3 }}>
                      <Typography variant="subtitle2" sx={{ fontSize: "1.1rem", fontWeight: 500, fontFamily: "Roboto", color: "#595959", textTransform: "uppercase" }}>
                        {truncateText(item.product.name, 16)}
                      </Typography>
                      <Typography variant="body1" sx={{ fontSize: 12, fontWeight: 500, fontFamily: "Roboto", color: "#8c8c8c", textTransform: "capitalize" }}>
                        {truncateText(item.product.description, 30)}
                      </Typography>
                      <Stack direction={"row"} spacing={2} alignItems={"center"}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 500, color: "salmon", fontSize: 15 }}>
                          &#8377; {item.price || 'N/A'}
                        </Typography>
                        <Typography sx={{ display: "inline-flex", fontSize: 12, color: "salmon", paddingLeft: 2 }}>
                          Color:
                        </Typography>
                        <Box sx={{ width: 20, height: 20, borderRadius: "50%", backgroundColor: item.selectedColour.hexCode || '#fff', marginLeft: 1 }}></Box>
                      </Stack>
                      <Stack>
                        <Typography variant="subtitle2" color="#8c8c8c">
                          Size: {item.selectedVariant || 'N/A'}
                        </Typography>
                      </Stack>
                      <Box sx={{ display: "flex", alignItems: "center", border: "1px solid #d9d9d9", borderRadius: "10px", width: "120px", height: "30px", overflow: "hidden" }}>
                        <IconButton onClick={() => handleDecrease(item._id, item.selectedColour, item.selectedVariant)} sx={{ borderRadius: 0, height: "100%", width: "33.33%", borderRight: "1px solid #d9d9d9" }}>
                          <Remove />
                        </IconButton>
                        <Typography variant="body1" sx={{ width: "33.33%", textAlign: "center", fontWeight: "bold", userSelect: "none", color: "salmon" }}>
                          {item.quantity}
                        </Typography>
                        <IconButton onClick={() => handleIncrease(item.product._id, item.selectedColour, item.selectedVariant)} sx={{ borderRadius: 0, height: "100%", width: "33.33%", borderLeft: "1px solid #d9d9d9" }}>
                          <Add />
                        </IconButton>
                      </Box>
                      <Stack direction={"row"} spacing={2} paddingTop={1}>
                        <Stack direction="row" spacing={3} alignItems="center">
                          <Button variant="outlined" startIcon={<Bookmark sx={{ color: "salmon" }} />} sx={{ borderRadius: "8px", color: "salmon", borderColor: "salmon", "&:hover": { boxShadow: "none" } }}>
                            Save For Later
                          </Button>
                        </Stack>
                        <Stack direction="row" spacing={3} alignItems="center">
                          <Button variant="outlined" startIcon={<Favorite sx={{ color: "salmon" }} />} sx={{ borderRadius: "8px", color: "salmon", borderColor: "salmon", "&:hover": { boxShadow: "none" } }}>
                            Add To Wishlist
                          </Button>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Grid>
                </Grid>
              ))}
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  border: "1px solid salmon",
                  borderRadius: 3,
                  padding: 1,
                  display: "flex",
                  flexDirection: "column",
                  padding: 3,
                }}
              >
                
                <Stack
                  direction={"row"}
                  spacing={2}
                  justifyContent={"space-between"}
                >
                  <Typography
                    sx={{
                      fontSize: "1.2rem",
                      fontWeight: 500,
                      color: "#254000",
                      fontFamily: "Roboto",
                      paddingTop: 1,
                    }}
                  >
                    Shop Name{" "}
                  </Typography>
                  <Box position={"relative"} sx={{ top: -15 }}>
                    <img
                      src={MyLogo}
                      alt="My Logo"
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                </Stack>

                <Stack
                  justifyContent={"space-between"}
                  paddingX={3}
                  spacing={2}
                >
                  <Stack direction={"row"} justifyContent={"space-between"}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 500, color: "#595959", fontSize: 15 }}
                    >
                      Total Product:
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 500, color: "salmon", fontSize: 15 }}
                    >
                      {items.length || 0}
                    </Typography>
                  </Stack>
                  <Stack direction={"row"} justifyContent={"space-between"}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 500, color: "#595959", fontSize: 15 }}
                    >
                      Total Quantity:{" "}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 500, color: "salmon", fontSize: 15 }}
                    >
                      {totalQuantity}
                    </Typography>
                  </Stack>
                  <Stack direction={"row"} justifyContent={"space-between"}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 500, color: "#595959", fontSize: 15 }}
                    >
                      Subtotal:{" "}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 500, color: "salmon", fontSize: 15 }}
                    >
                      {cartData.totalPrice.$numberDecimal}
                    </Typography>
                  </Stack>
                </Stack>
                <Stack marginTop={4}>
                  <Link
                    to={"/shipping"}
                    variant="contained"
                    color="salmon"
                    style={{
                      borderRadius: "8px",
                      padding: "8px 16px",
                      fontWeight: 500,
                      textTransform: "capitalize",
                      borderColor: "salmon",
                      border: "1px solid salmon",
                      color: "salmon",
                      textDecoration: "none",
                      textAlign: "center",
                    }}
                  >
                    Continue to shipping
                  </Link>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default Cart;

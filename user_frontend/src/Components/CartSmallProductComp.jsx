import { Badge, Box, Container, Divider, Stack, Typography } from "@mui/material";
import React, { useEffect } from "react";
import FirstImage from "../assets/Images/iqoo1.png";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartProduct } from "../Redux/Slices/ProductSlice";
import { Link } from "react-router-dom";

const CartSmallProductComp = () => {
  const dispatch = useDispatch();
  const cartData = useSelector((state) => state.appData.cartData || { items: [] });
  const items = cartData.items || [];
  const totalPrice = parseFloat(cartData.totalPrice.$numberDecimal).toFixed(2);
  useEffect(()=>{
    dispatch(fetchCartProduct());
  },[dispatch])

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

  return (
    <>
    {items.map((item)=>(
      <Stack
      direction={"row"}
      spacing={1}
      alignItems={"center"}
      justifyContent={"space-between"}
      pt={2}
      key={item._id}
    >
      <Badge badgeContent={item.quantity || 0} color="success">
        <Box
          sx={{
            backgroundColor: "#fff",
            border: "1px solid salmon",
            borderRadius: 2,
            padding: 1,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            //src={FirstImage}
            src={item.product?.colors?.[0]?.images?.[0]?.secure_url || ''}
            alt="My image"
            style={{ width: "80px", height: "80px", objectFit: "contain" }}
          />
        </Box>
      </Badge>

      <Typography
        sx={{ fontSize: "1.2rem", fontWeight: 500, color: "salmon" }}
      >
        &#8377; {item.price}.00
      </Typography>
    </Stack>
    ))}

      <Divider sx={{ paddingTop: 1 }} />

      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        paddingY={1}
        paddingX={2}
      >
        <Typography sx={{ fontWeight: 500, color: "#254000" }}>
          SubTotal:{" "}
        </Typography>
        <Typography sx={{ fontWeight: 400, color: "green" }}>
          &#8377; {totalPrice}
        </Typography>
      </Stack>
    </>
  );
};

export default CartSmallProductComp;

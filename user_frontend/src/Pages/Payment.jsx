import {
  Box,
  Collapse,
  Container,
  FormControlLabel,
  Grid2,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
  Button,
  FormControl,
  Divider,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import BreadCrimbs from "../Components/BreadCrimbs";
import { ChevronLeft, ExpandMore, Lock } from "@mui/icons-material";
import CartSmallProductComp from "../Components/CartSmallProductComp";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, clearCartItems, createOrder } from "../Redux/Slices/ProductSlice";

const Payment = () => {
  const [expanded, setExpanded] = useState(false);
  const [expand1, setExpand1] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const defaultAddress = useSelector((state)=>state.appData.defaultAddressId || 'null');
  const cartItems = useSelector((state) => state.appData.cartData || { items: [] });
  const totalPrice = cartItems.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const {isLoading,error} = useSelector((state)=>state.appData.isLoading);
  const dispatch = useDispatch();
  const [orderData,setOrderData]=useState({
    paymentMethod: '',
    shippingMethod: 'standard',
    selectedAddress: defaultAddress,
    cartItems: cartItems.items,
    totalPrice: totalPrice,
  })

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleExpandClick1 = () => {
    setExpand1(!expand1);
  };
  const handlePaymentMethodChange = (event) => {
    setSelectedPaymentMethod(event.target.value);
  };
  const handleOrder = () => {
    const data = {
      paymentMethod: selectedPaymentMethod,
      shippingMethod: 'standard',
      selectedAddress: defaultAddress,
      cartItems: cartItems.items,
      totalPrice: totalPrice,
    };
    dispatch(createOrder(data))
    .unwrap() // Correct the spelling here
    .then(() => {
      dispatch(clearCartItems()); // Clear cart items after successful order
    })
    .catch((error) => {
      console.error('Order creation failed', error);
    });
    
    
  };


  return (
    <>
      <Container maxWidth="lg">
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            sx={{
              fontWeight: 700,
              color: "#254000",
              fontSize: "2rem",
              marginTop: 6,
              paddingBottom: 5,
            }}
          >
            Payment
          </Typography>
          <BreadCrimbs />

          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, md: 7 }}>
              <Box
                sx={{
                  border: "1px solid #bfbfbf",
                  padding: 2,
                  borderRadius: 3,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 10,
                    color: "red",
                    textTransform: "capitalize",
                  }}
                >
                  Note: When you add new address after add then select address
                  to proceed
                </Typography>
                <Stack
                  direction={"row"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  sx={{
                    border: "1px solid salmon",
                    paddingX: 2,
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontFamily: "Roboto",
                      color: "#595959",
                    }}
                  >
                    Select Shipping Method
                  </Typography>
                  <IconButton
                    sx={{
                      boxShadow: "none",
                      transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.3s ease-in-out",
                    }}
                    onClick={handleExpandClick}
                  >
                    <ExpandMore />
                  </IconButton>
                </Stack>
                <Collapse
                  in={expanded}
                  timeout="auto"
                  unmountOnExit
                  sx={{ border: "1px solid salmon", borderRadius: 2 }}
                >
                  <Box sx={{ marginTop: 2, paddingX: 2 }}>
                    <RadioGroup name="shippingMethod" defaultValue="standard">
                      <FormControlLabel
                        value="express"
                        control={<Radio />}
                        label="Express Delivery &#8377; 40.00"
                        sx={{ border: "1px solid #bfbfbf", borderRadius: 2 }}
                      />
                      <FormControlLabel
                        value="standard"
                        control={<Radio />}
                        label="Standard Delivery &#8377; 27.00"
                        sx={{
                          border: "1px solid #bfbfbf",
                          borderRadius: 2,
                          marginTop: 1,
                          marginBottom: 1,
                        }}
                      />
                      <FormControlLabel
                        value="free"
                        control={<Radio />}
                        label="Free Delivery &#8377; 00.00"
                        sx={{
                          border: "1px solid #bfbfbf",
                          borderRadius: 2,
                          marginTop: 1,
                          marginBottom: 1,
                        }}
                      />

                      {/* Add more addresses here as needed */}
                    </RadioGroup>
                  </Box>
                </Collapse>

                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{
                    border: "1px solid salmon",
                    paddingX: 2,
                    borderRadius: 2,
                    marginTop: 2,
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontFamily: "Roboto",
                      color: "#595959",
                    }}
                  >
                    Select Payment Method
                  </Typography>
                  <IconButton
                    sx={{
                      boxShadow: "none",
                      transform: expand1 ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.3s ease-in-out",
                    }}
                    onClick={handleExpandClick1}
                  >
                    <ExpandMore />
                  </IconButton>
                </Stack>
                {/* Main Collapse */}
                <Collapse
                  in={expand1}
                  timeout="auto"
                  unmountOnExit
                  sx={{ border: "1px solid salmon", borderRadius: 2 }}
                >
                  <Box sx={{ marginTop: 2, paddingX: 2, paddingBottom: 2 }}>
                    {/* Payment Method Radio Buttons */}
                    <FormControl component="fieldset" fullWidth>
                      <RadioGroup
                        value={selectedPaymentMethod}
                        onChange={handlePaymentMethodChange}
                      >
                        <FormControlLabel
                          value="COD"
                          control={<Radio />}
                          label="Cash on Delivery"
                        />
                        <Divider />

                        {/* <FormControlLabel
                          value="CreditCard"
                          control={<Radio />}
                          label="Debit Card"
                        /> */}
                        <Divider />
                        <FormControlLabel
                          value="CreditCard"
                          control={<Radio />}
                          label="Credit Card"
                        />
                        <Divider />
                        <FormControlLabel
                          value="UPI"
                          control={<Radio />}
                          label="UPI"
                        />
                      </RadioGroup>
                    </FormControl>

                    {/* Conditional Rendering for Debit/Credit Card Details */}
                    {(selectedPaymentMethod === "CreditCard" ||
                      selectedPaymentMethod === "debitCard") && (
                      <Collapse in={true} timeout="auto" unmountOnExit>
                        <Stack spacing={2} sx={{ paddingTop: 2 }}>
                          <TextField
                            fullWidth
                            placeholder="Card Number"
                            type="text"
                          />
                          <TextField
                            fullWidth
                            placeholder="Card Holder Name"
                            type="text"
                          />
                          <Stack direction="row" spacing={1}>
                            <TextField
                              fullWidth
                              placeholder="Expiry Date (MM/YY)"
                              type="text"
                            />
                            <TextField
                              fullWidth
                              placeholder="CVV"
                              type="password"
                            />
                          </Stack>
                        </Stack>
                      </Collapse>
                    )}

                    {/* Conditional Rendering for UPI Details */}
                    {selectedPaymentMethod === "UPI" && (
                      <Collapse in={true} timeout="auto" unmountOnExit>
                        <Stack spacing={2} sx={{ paddingTop: 2 }}>
                          <TextField
                            fullWidth
                            placeholder="Enter UPI Address"
                            type="text"
                          />
                        </Stack>
                      </Collapse>
                    )}
                  </Box>
                </Collapse>
              </Box>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 5 }}>
              <Stack
                sx={{ border: "1px solid salmon", borderRadius: 2, padding: 2 }}
              >
                <Typography
                  sx={{ fontSize: 14, fontWeight: 500, color: "#8c8c8c" }}
                >
                  Your Bag
                </Typography>

                <CartSmallProductComp />

                <Stack
                  textAlign={"center"}
                  sx={{
                    // border: "1px solid salmon",
                    borderRadius: 2,
                    paddingY: 1,
                    marginTop: 3,
                  }}
                >
                  <Button
                    // to={"/payment"}
                    onClick={()=>handleOrder()}
                    sx={{ textDecoration: "none", color: "salmon" ,marginTop:3}}
                    startIcon={<Lock />}
                    disabled={isLoading}
                  >
                    {/* {isLoading ? 'Payment Initiated' : 'Secure Payment'} */}
                    {isLoading ? <CircularProgress size={24} /> : 'Secure Payment'}
                  </Button>
                </Stack>
              </Stack>
            </Grid2>
          </Grid2>
        </Box>
        <Stack direction={"row"}>
          <ChevronLeft />
          <Link to={"/"} style={{ textDecoration: "none" }}>
            <Typography>Home</Typography>
          </Link>
        </Stack>
      </Container>
    </>
  );
};

export default Payment;

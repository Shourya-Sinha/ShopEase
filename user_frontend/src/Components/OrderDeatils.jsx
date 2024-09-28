import React, { useEffect, useState } from "react";
import FirstImage from "../assets/Images/iqoo1.png";
import SecondImage from "../assets/Images/iqoo2.png";
import { Box, Button, Collapse, Container, Grid2, Stack, TextField, Typography } from "@mui/material";
import { ContactSupportOutlined, ShoppingBag } from "@mui/icons-material";
import { Link, useParams } from "react-router-dom";
import ReactStars from "react-stars";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleOrder, giveReview } from "../Redux/Slices/ProductSlice";

const OrderDeatils = () => {
  const [isReviewOpen, setReviewOpen] = useState(false);
  const singleOrder = useSelector((state) => state.appData.singleOrder || {});
  const {isLoading,error}=useSelector((state)=>state.appData);
  const { orderId } = useParams(); 
  const dispatch =useDispatch();
  const name = useSelector((state) => state.auth.name || 'Null');
  const email = useSelector((state) => state.auth.email || 'Null')


  const [reviewData,setReviewData] = useState({
    star: 0,
    revTitle: "",
    comment: "",
    name,
    email,
  })

  const item = singleOrder?.items?.[0];// Access the first item of the order
  const selectedColour = item?.selectedColour; 
  const product = item?.product || {};
  const colors = product.colors || [];
  const selectedColorObject = colors.find(
    (colorObj) => colorObj.color === selectedColour
  );
  // Get the images array from the selected color object
  const totalPrice = singleOrder?.totalPrice?.$numberDecimal || 0;

  const toggleReviewForm=()=>{
    setReviewOpen((prev) => !prev);
  };

  useEffect(() => {
    dispatch(fetchSingleOrder(orderId));
  }, [dispatch, orderId]);

  const handleChange = (e) => {
    setReviewData({
      ...reviewData,
      [e.target.name]: e.target.value,
    });
  };

  const handleStarChange = (newRating) => {
    setReviewData({ ...reviewData, star: newRating });
  };

  const handleSubmitReview = (e,productId) => {
    e.preventDefault();
    const reviewPayload = { ...reviewData, productId };
    dispatch(giveReview(reviewPayload)); // Pass review data along with productId
  };

  const averageRating = Array.isArray(product.ratings) && product.ratings.length
  ? product.ratings.reduce((acc, rating) => acc + rating.star, 0) / product.ratings.length
  : 0;

  console.log('order details in page',item);

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
            Loading order data...
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
            Error loading order data..: {error.message}
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}


  return (
<>
<Container maxWidth="lg" sx={{ marginTop: 5 }}>
        <Box sx={{ width: "100%" }}>
          <Typography sx={{ fontWeight: 700, color: "#bfbfbf", fontSize: 22 }}>
            Order Details
          </Typography>

          <Box
            sx={{
              border: "1px solid #f0f0f0",
              padding: 1,
              borderRadius: 2,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Grid2 container>
              {singleOrder.items?.map((item, index) => {
                const product = item?.product || {};
                const colors = product.colors || [];
                const selectedColour = item?.selectedColour;
                const selectedColorObject = colors.find(
                  (colorObj) => colorObj.color === selectedColour
                );

                const images = selectedColorObject?.images?.map((imgObj) => imgObj.secure_url) || [];
                const itemPrice = item?.price?.$numberDecimal || 0;
                


                return (
                  <Grid2 size={{ md: 12 }} key={index}>
                    <Box padding={2} marginBottom={2} sx={{ border: '1px solid #dfdfdf', borderRadius: 3 }}>
                      <Stack direction={'row'} justifyContent={'space-between'}>
                        <Typography sx={{ fontSize: 10, fontWeight: 500, color: '#8c8c8c' }}>
                          Order Id: {singleOrder._id}
                        </Typography>
                        <Stack direction={'row'} alignItems={'center'} spacing={2}>
                          <Typography sx={{ fontSize: 10, fontWeight: 500, color: '#8c8c8c' }}>
                            Order Date: {new Date(singleOrder.createdAt).toLocaleString()}
                          </Typography>
                          <Link sx={{ paddingTop: 2, fontSize: 15, fontWeight: 500 }}>
                            Generate Bill
                          </Link>
                        </Stack>
                      </Stack>

                      <Stack direction={'row'} spacing={3} paddingTop={2}>
                        {images.length > 0 ? (
                          <img
                            src={images[0]}
                            alt="Selected Product"
                            style={{
                              width: '180px',
                              height: '180px',
                              objectFit: 'contain',
                              backgroundColor: '#f0f0f0',
                              padding: '3px',
                              borderRadius: '10px',
                            }}
                          />
                        ) : (
                          <Typography>No image available for the selected color.</Typography>
                        )}
                        <Stack paddingTop={3} spacing={1}>
                        <ReactStars
                            count={5}
                            size={20}
                            value={averageRating} // Set the average rating
                            edit={false} // Disable editing if it's just for display
                            color={'#254000'}
                            activeColor={'#ffb400'} // Change the active color as needed
                          />
                          <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
                            Product Name: {product.name || "Product Name"}
                          </Typography>
                          <Typography sx={{ fontSize: 11, fontWeight: 500 }}>
                            Product Description: {product.description || "Product Desc"}
                          </Typography>
                          <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
                            Product Price: &#8377; {itemPrice}
                          </Typography>
                          <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
                            Quantity: {item?.quantity || 1}
                          </Typography>
                        </Stack>
                      </Stack>

                      <Stack
                        direction={'row'}
                        justifyContent={'space-between'}
                        sx={{ flexWrap: 'wrap' }}
                      >
                        <Typography
                          sx={{ paddingTop: 2, fontSize: 15, fontWeight: 500 }}
                        >
                          Total Order Price: &#8377; {totalPrice}
                        </Typography>
                        <Button
                          onClick={toggleReviewForm}
                          sx={{ fontSize: 12, color: '#8c8c8c', boxShadow: 'none', textDecoration: 'underline' }}
                        >
                          Write a Review
                        </Button>
                      </Stack>

                      <Collapse in={isReviewOpen}>
                        <Box sx={{ marginTop: 2, border: '1px solid #dfdfdf', borderRadius: 3, padding: 2 }}>
                          <Typography variant='h6' sx={{ marginBottom: 2 }}>
                            Write Your Review
                          </Typography>
                          <ReactStars
                              count={5}
                              size={24}
                              value={reviewData.star}
                              color={"#ffd700"}
                              onChange={handleStarChange} // Capture star rating change
                            />
                          <TextField
                              fullWidth
                              label="Title"
                              variant="outlined"
                              name="revTitle"
                              value={reviewData.revTitle}
                              onChange={handleChange}
                              sx={{ marginBottom: 2 }}
                            />
                          <TextField
                              fullWidth
                              label="Description"
                              multiline
                              rows={4}
                              variant="outlined"
                              name="comment"
                              value={reviewData.comment}
                              onChange={handleChange}
                              sx={{ marginBottom: 2 }}
                            />
                           <TextField
                              fullWidth
                              label="Name"
                              variant="outlined"
                              value={reviewData.name}
                              name="name"
                              disabled // Name and email should be pre-filled and non-editable
                              sx={{ marginBottom: 2 }}
                            />
                          <TextField
                              fullWidth
                              label="Email"
                              variant="outlined"
                              value={reviewData.email}
                              name="email"
                              disabled
                              sx={{ marginBottom: 2 }}
                            />
                          <Button variant='contained' color='secondary' sx={{ marginTop: 2 }} onClick={(e)=>handleSubmitReview(e,item.product._id)}>
                            Submit Review
                          </Button>
                        </Box>
                      </Collapse>
                    </Box>
                  </Grid2>
                );
              })}
            </Grid2>
          </Box>
        </Box>
      </Container>
</>
  );
};

export default OrderDeatils;

import { Box, Container, Grid2, IconButton, Paper, Stack, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import FirstImage from '../assets/Images/iqoo1.png';
import SecondImage from '../assets/Images/iqoo2.png';
import { ShoppingBag, ShoppingCart, Visibility } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMyOrder } from '../Redux/Slices/ProductSlice';

const OurOrder = () => {
  const dispatch =useDispatch();
  const allOrders = useSelector((state)=>state.appData.myOrder || []);

  const {isLoading,error} = useSelector((state)=> state.appData);

  useEffect(()=>{
     dispatch(getMyOrder());
  },[dispatch]);

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
 <Container maxWidth="lg">
      <Box sx={{ width: '100%' }}>
        <Typography sx={{ fontWeight: 700, color: '#bfbfbf', fontSize: 22 }}>Order History</Typography>

        <Box sx={{ border: '1px solid #f0f0f0', padding: 1, borderRadius: 2, position: 'relative', overflow: 'hidden' }}>
          <Grid2 container spacing={2}>
            {allOrders.map((order)=>(
            <Grid2 xs={12} md={6} lg={4} key={order._id}>
            <Box
              padding={2}
              sx={{
                border: '1px solid #dfdfdf',
                borderRadius: 3,
              }}
            >
              <Stack>
                <Typography sx={{ fontSize: 10, fontWeight: 500, color: '#8c8c8c' }}>Order Id: {order._id}</Typography>
                <Typography sx={{ fontSize: 10, fontWeight: 500, color: '#8c8c8c' }}>Order Date: {new Date(order.createdAt).toLocaleString()}</Typography>
              </Stack>
              
              <Stack direction={'row'} spacing={3} paddingTop={2} justifyContent={'center'}>
              {order.items.map((item)=>(
                  <img
                  // src={FirstImage}
                  key={item._id}
                  src={item.product?.colors?.[0]?.images[0].secure_url || FirstImage}
                  alt="First Order"
                  style={{
                    width: 80,
                    height: 80,
                    objectFit: 'contain',
                    backgroundColor: '#f0f0f0',
                    padding: 3,
                    paddingTop: 4,
                    paddingBottom: 4,
                    borderRadius: 10,
                  }}
                />
              ))}
              </Stack>
              
              <Stack paddingTop={2}>
                <Typography sx={{ fontSize: 13, fontWeight: 500 }}>Order Price : {order.totalPrice.$numberDecimal}</Typography>
              </Stack>
              <Stack direction={'row'} spacing={1} justifyContent={'space-between'} paddingX={1} paddingTop={1}>
                 
                <Stack direction={'row'} alignItems={'center'} spacing={1}>
                  <Visibility fontSize='12px' />
                  <Link to={`/myOrder/${order._id}`} style={{textDecoration:'none',fontSize:12,fontWeight:500,color:'#254000'}}>View Details</Link>
                </Stack>
              </Stack>
            </Box>
          </Grid2>
            ))}

          </Grid2>
        </Box>
      </Box>
    </Container>
    </>
  )    
}

export default OurOrder;
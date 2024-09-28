import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import { getProductByCategory } from '../Redux/Slices/ProductSlice';
import { Box, Button, Container, Grid2, Stack, Typography } from '@mui/material';
import ReactStars from 'react-stars';

const SearchResult = () => {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('categoryId');  // Get categoryId from query params
  const subCategoryName = searchParams.get('subCategoryName'); 
  const dispatch = useDispatch();
  const products = useSelector((state) => state.appData.searchDataFromCategory || []);
  const { isLoading } = useSelector((state) => state.appData);
  const {error} = useSelector((state)=>state.appData.error);

  // useEffect(() => {
  //   if ((categoryId || subCategoryName) && products.length === 0) {
  //     // Dispatch action with both categoryId and subCategoryName
  //     dispatch(getProductByCategory({ categoryId, subCategoryName }));
  //   }
  // }, [categoryId, subCategoryName, products.length, dispatch]);

    useEffect(() => {
    if (categoryId || subCategoryName) {
      // Dispatch action with both categoryId and subCategoryName
      dispatch(getProductByCategory({ categoryId, subCategoryName }));
    }
  }, [categoryId, subCategoryName, dispatch]);


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
             Error loading cart data: {error.message}
            </Typography>
          </Box>
        </Box>
      </Container>
    );
  }

  if (products.length > 0) {
    return (
      <Container maxWidth='lg'>
        <Typography variant='h4' sx={{ fontWeight: 700, marginY: 4, marginTop: 6 }}>
          Search Result
        </Typography>
        <Box sx={{ height: "100vh", backgroundColor: "#F5F5F5" }}>
          <Grid2 container spacing={2} marginTop={2}>
            {products.map((product) => (
              <Grid2 size={{ xs: 12, md: 3, lg: 3 }} key={product._id} sx={{ borderRadius: 2, backgroundColor: '#fff' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <img src={product.colors[0]?.images[0]?.secure_url} alt='Category Pic' style={{ width: 200, height: 220, objectFit: 'contain' }} />
                </Box>
                <Box sx={{ paddingX: 3 }}>
                  <Typography variant='subtitle2' sx={{ color: '#8c8c8c', fontWeight: 500 }}>{product.category.subCategory}</Typography>
                  <Typography variant='subtitle2' sx={{ fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{product.name}</Typography>
                  <Typography variant='body2' sx={{color:'#237804',fontWeight:500}}> &#8377; {product.colors[0]?.variants[0]?.price}.00 </Typography> 
                  <Stack direction={'row'} alignItems={'center'} spacing={2}>
                  <ReactStars value={product.totalRatings} />
                  <Typography variant='body2' sx={{fontWeight:500}}>({product.ratings.length + " " + 'Ratings' || '0 Ratings'})</Typography>
                  </Stack>
                  <Box sx={{marginTop:3}}>
                  <Button fullWidth><Link to={`/product/${product._id}`} style={{textDecoration:'none',fontWeight:500}}>View Details</Link> </Button>
                  </Box>                
                </Box>
              </Grid2>
            ))}
          </Grid2>
        </Box>
      </Container>
    );
  }

  return (
    <>
    {/* <Container maxwidth='lg'>
    <Typography variant='h4' sx={{fontWeight:700,marginY:4,marginTop:6}}>Search Result</Typography>
        <Box
          sx={{
            height: "100vh",
            backgroundColor: "#F5F5F5",
          }}
        >
          <Grid2 container spacing={2} marginTop={2}>          
            {products.length > 0 && products.map((product)=>(
 <Grid2 size={{xs:12,md:3,lg:3}} key={product._id} sx={{borderRadius:2,backgroundColor:'#fff'}}>
 <Box sx={{display:'flex',justifyContent:'center',alignItems:'center'}}>
  <img src={product.colors[0]?.images[0]?.secure_url} alt='Category Pic' style={{width:200,height:220,objectFit:'contain'}} />
 </Box>
 <Box sx={{paddingX:2}}>
  <Typography variant='subtitle2' sx={{color:'#8c8c8c',fontWeight:500}}>{product.category.subCategory}</Typography>
  <Typography variant='subtitle2' sx={{fontWeight:500,whiteSpace: "nowrap",overflow: "hidden",textOverflow: "ellipsis"}}>{product.name}</Typography>
 </Box>
</Grid2>
            ))}
            
          </Grid2>
        </Box>
      </Container> */}
       <Container>
      <Typography variant='h6' align="center" sx={{ marginTop: 5 }}>
        No products available
      </Typography>
    </Container>
    </>
  )
}

export default SearchResult;
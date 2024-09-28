import {
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Add, Remove } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { addToProduct, fetchOneProduct } from "../Redux/Slices/ProductSlice";
import { useParams } from "react-router-dom";

const SingleProduct = () => {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const { productId } = useParams();
  const [topImage, setTopImage] = useState(null);
  const {isLoading,error} = useSelector((state)=> state.appData);
  const fetchedProduct = useSelector((state)=>state.appData.singleProduct || null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const token = useSelector((state)=> state.auth.token);

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  useEffect(() => {
    if (productId) {
      dispatch(fetchOneProduct(productId));
    }
  }, [dispatch, productId]);

  useEffect(() => {
    if (fetchedProduct && fetchedProduct.colors.length > 0) {
      // Default to the first color if available
      setSelectedColor(fetchedProduct.colors[0].color);
    }
  }, [fetchedProduct]);

  useEffect(() => {
    if (selectedColor) {
      // Set the default top image to the first image of the selected color
      const defaultTopImage = fetchedProduct.colors.find(c => c.color._id === selectedColor?._id)?.images[0];
      setTopImage(defaultTopImage);
    }
  }, [selectedColor, fetchedProduct]);

  useEffect(() => {
    if (selectedColor && fetchedProduct) {
      // Set default variant to the first variant of the selected color
      const defaultVariant = fetchedProduct.colors.find(c => c.color._id === selectedColor?._id)?.variants[0];
      setSelectedVariant(defaultVariant);
    }
  }, [selectedColor, fetchedProduct]);

  useEffect(() => {
    if (productId) {
      dispatch(fetchOneProduct(productId)).catch((error) => {
      });
    }
  }, [dispatch, productId]);

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  const handleImageClick = (image) => {
    setTopImage(image); // Update the top image on click
  };

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant); // Update the selected variant
  };
  // Render loading and error states

  const handleAddToCart = () => {
    const cartItem = {
      productId: fetchedProduct._id,
      selectedColour: selectedColor._id,
      selectedVariant: selectedVariant.name,
      quantity // use the current quantity
    };
    dispatch(addToProduct(cartItem));
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
              Loading Product data...
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
              Error loading Product data..: {error.message}
            </Typography>
          </Box>
        </Box>
      </Container>
    );
  }

  // Render the fetched product once it is available
  if (!fetchedProduct) {
    return ( <Container>
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
          No product Found
        </Typography>
      </Box>
    </Box>
  </Container>);
  }

  const images = fetchedProduct.colors.find(c => c.color._id === selectedColor?._id)?.images || [];
  const variants = fetchedProduct.colors.find(c => c.color._id === selectedColor?._id)?.variants || [];
  return (
    <Container maxWidth="lg">
      <Typography
        sx={{ paddingY: 3, fontSize: "2rem", fontWeight: 500, color: "salmon" }}
      >
        Product Details
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: 4,
          paddingTop: 4,
          border: "1px solid #d9d9d9",
          padding: 2,
          borderRadius: 3,
        }}
      >
        {/* Left Side: Images */}
        <Box sx={{ flex: 1 }}>
          {/* Top Image */}
          <Box
            sx={{
              width: "100%",
              mb: 2,
              display: "flex",
              justifyContent: "center",
              border: "1px solid #f0f0f0",
              borderRadius: 5,
            }}
          >
            {topImage ? (
 <img
 src={topImage?.secure_url}
 alt="Top Product"
 style={{
   width: "400px",
   height: "550px",
   borderRadius: 8,
   objectFit: "contain",
 }}
/>
            ) : (<p>No Image Aavailable</p>)}
           
          </Box>

          {/* Bottom Images */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 2,
              height:'300px',
              overflowY:'auto'
            }}
          >
            {images.slice(1).map((img, index) => (
              <Box
                key={index}
                sx={{
                  borderRadius: 2,
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                  padding: 2,
                  border: "1px solid #f0f0f0",
                  cursor: "pointer",
                }}
                onClick={() => handleImageClick(img)}
              >
                <img
                   src={img?.secure_url}
                  alt={`Bottom Product ${index + 1}`}
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: 8,
                    objectFit: "contain",
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>

        {/* Right Side: Product Details */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 3,
            paddingTop: 5,
          }}
        >
          {/* Product Name */}
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {fetchedProduct.name || 'N/A'}
          </Typography>

          {/* Product Description */}
          <Typography
          component={'div'}
            variant="subtitle2"
            sx={{ color: "text.secondary", textAlign: "justify" }}
          >
            {fetchedProduct.description || 'N/A'}
          </Typography>

          <Typography
            variant="body2"
            sx={{ fontSize: "1.2rem", fontWeight: 500, color: "salmon" }}
          >
            Price: &#8377;{selectedVariant?.price || 'N/A'}
          </Typography>

          <Box 
  display="flex" 
  flexDirection="row" 
  flexWrap="wrap" 
  alignItems="center" 
  spacing={2}
>
  <Typography sx={{ flexShrink: 0 }}>Size:</Typography>
  {variants.map((variant) => (
              <Typography
                key={variant._id}
                onClick={() => handleVariantChange(variant)} // Set selected variant on click
                variant="subtitle2"
                sx={{
                  padding: 1,
                  border: "1px solid #d9d9d9",
                  borderRadius: 2,
                  margin: 0.5, // Adjust margin as needed
                  cursor: "pointer",
                  backgroundColor: selectedVariant?._id === variant._id ? "#f0f0f0" : "transparent", // Highlight selected variant
                }}
              >
                {variant.name} {/* Displaying the size name */}
              </Typography>
            ))}
</Box>

          {/* Quantity Controls */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #d9d9d9",
              borderRadius: "10px",
              width: "120px",
              height: "30px",
              overflow: "hidden",
              // flexDirection:'row',
            }}
          >
            {/* Decrease Button */}
            <IconButton
              onClick={decreaseQuantity}
              sx={{
                borderRadius: 0,
                height: "100%",
                width: "33.33%",
                borderRight: "1px solid #d9d9d9",
              }}
            >
              <Remove />
            </IconButton>

            {/* Quantity Display */}
            <Typography
              variant="body1"
              sx={{
                width: "33.33%",
                textAlign: "center",
                fontWeight: "bold",
                userSelect: "none", // Prevent text selection
                color: "salmon",
              }}
            >
              {quantity}
            </Typography>

            {/* Increase Button */}
            <IconButton
              onClick={increaseQuantity}
              sx={{
                borderRadius: 0,
                height: "100%",
                width: "33.33%",
                borderLeft: "1px solid #d9d9d9",
              }}
            >
              <Add />
            </IconButton>
          </Box>
          {/* Color Options */}
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          {fetchedProduct.colors.map((color) => (
              <Paper
                key={color.color._id}
                onClick={() => handleColorChange(color.color)} // Set selected color on click
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  backgroundColor: color.color.hexCode,
                  cursor: "pointer",
                  border: selectedColor?._id === color.color._id ? "2px solid #000" : "none", // Highlight selected color
                }}
              />
            ))}
            
           
          </Stack>

          <Stack direction={"row"} alignItems={"center"} spacing={1}>
          <Rating color={"#254000"} value={fetchedProduct.totalRatings || 0} readOnly />
            <Typography sx={{ fontSize: 10, color: "#8c8c8c" }}>
            {fetchedProduct.totalRatings === 0 ? '(0 Ratings)' : `(${fetchedProduct.totalRatings} Ratings)`}
            </Typography>
          </Stack>
          {/* Action Buttons */}
          <Stack direction="row" spacing={2} sx={{ mt: 2 }} onClick={handleAddToCart}>
            <Button variant="contained" color="primary" fullWidth>
              Add To Cart
            </Button>
            <Button variant="outlined" color="secondary" fullWidth>
              Save for Later
            </Button>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
};

export default SingleProduct;

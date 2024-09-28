import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import React, { useEffect, useState } from "react";
import "../../Layout/HeaderStyle.css";
import Electronics from "../../assets/Images/tech.jpg";
import MenCloth from "../../assets/Images/mencoat.jpg";
import WomenCloth from "../../assets/Images/travel.jpg";
import kids from "../../assets/Images/handbag.jpg";
import Furtinutre from "../../assets/Images/furniture.jpg";
import Jwellary from "../../assets/Images/sneakers.jpg";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategory } from "../../Redux/Slices/ProductSlice";
import { useNavigate } from "react-router-dom";

const CategoryImages = [
  Electronics,
  MenCloth,
  WomenCloth,
  kids,
  Furtinutre,
  Jwellary,
];

const CategoryNameList = [
  "Tech",
  "Fashion",
  "Travel",
  "Bag",
  "Furniture",
  "Sneakers",
];

const gradientTextStyle = {
  fontSize: "13px",
  fontWeight: 700,
  color: "#fff",
  paddingTop:1,
  paddingLeft:2,
  display:'flex',
  flexDirection: 'column',
};

const imageInnerStyle = {
  width:'100%',
  height: '250px',
  objectFit: "contain",
  borderRadius: "5px", // Ensures image matches the border-radius of the wrapper
};
const CategorySections = () => {
  const categories = useSelector((state) => state.appData?.category || []);
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.appData.isLoading);
    const error = useSelector((state) => state.appData.error);
    const navigate = useNavigate();
    const [cateData,setCatData]=useState({
      categoryId:'',
      subCategoryName:''
    })

  useEffect(()=>{
    dispatch(fetchCategory());
  },[dispatch])

const limitedCategories = categories.slice(0, 6);

const handleCategoryClick = (categoryId, subCategoryName) => {
  // Navigate with both categoryId and subCategoryName as query params
  navigate(`/search-results?categoryId=${categoryId}&subCategoryName=${subCategoryName}`);
};

  if (isLoading) {
    return <p>Loading categories...</p>;
}

if (error) {
    return <p>Error loading categories</p>;
}


  return (
    <>
<Container maxWidth="lg">
  <Box>
    <h6 className="gradientHeading" style={{ marginBottom: 10 }}>
      Shop From Top Category
    </h6>
    <Stack>
      {/* Correct grid container and spacing */}
      <Grid container spacing={3}>
        {/* Set item width for large screens to display 3 items per row */}
        {limitedCategories.map ((category, index) => (
          <Grid  size={{ xs: 12, md: 4, xl:2, sm:6 }} key={index}  onClick={() => handleCategoryClick(category._id, category.subCategory)}>
            <Box sx={{backgroundColor:'#000',borderRadius:2}}>
            <Box sx={{justifyContent:'center',display:'flex'}}>
              <img
                src={category.catPic.secure_url}
                alt={CategoryNameList[index]}
                style={imageInnerStyle}
              />
              
            </Box>
           

            </Box>
            <Box sx={{position:'relative',bottom:50,left:50}}>
            <Typography sx={gradientTextStyle}>
              {limitedCategories[index].subCategory}
            </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Stack>
  </Box>
</Container>
    </>
  );
};

export default CategorySections;

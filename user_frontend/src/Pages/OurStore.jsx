import { DensityLarge, DensityMedium, DensitySmall } from "@mui/icons-material";
import {
  Box,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid2,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import StoreProduct from "../Components/StoreProduct";
import { useSelector } from "react-redux";

const ITEM_HEIGHT = 38;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 220,
    },
  },
};

const names = [
  'Alphabetically A-Z',
  'Alphabetically Z-A',
  'Newly Product',
  'Price Lowest to Highest',
  'Price Highest to Lowest',
  'Highest Ratings',
  'Lowest Ratings',
];

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const OurStore = () => {
    const theme = useTheme();
  const [personName, setPersonName] = useState([]);
  const [size,setSize] = useState(3);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState('');
  const [sortBy,setSortedBy] = useState('');
  const AllProduct = useSelector((state)=>state.appData.allProduct);
  const filterdProducts = useSelector((state)=>state.appData.filteredProducts ||[]);
  const categories = useSelector((state) => state.appData?.category || []);
  const AllNewProduct = (filterdProducts.length > 0) ? filterdProducts : AllProduct

  const AllProductLength = AllProduct.length;

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };
  const handleSizeChange = (newSize) => {
    setSize(newSize);
  };

  const handleMinPriceChange = (e) => {
    setMinPrice(e.target.value);
  };
  
  const handleMaxPriceChange = (e) => {
    setMaxPrice(e.target.value);
  };


  const handleSubCategoryClick = (subCategory) => {
    setSelectedSubCategory(subCategory);
};

const handleTagChange = (tag, e) => {
  e.preventDefault();
  // setSelectedTags(prevTags => {
  //     if (prevTags.includes(tag)) {
  //         return prevTags.filter(t => t !== tag); // Unselect tag if already selected
  //     } else {
  //         return [...prevTags, tag]; // Select tag if not selected
  //     }
  // });
  setSelectedTags(tag);
};

const handleChangeSorting=(event)=>{
  setSortedBy(event.target.value);
}

const filteredProducts = AllNewProduct.filter(product => {
  // Check if both minPrice and maxPrice are not provided and no subcategory is selected
  if (!minPrice && !maxPrice && !selectedSubCategory) {
    return true; // Keep all products
  }

  // Parse min and max prices
  const minPriceNum = parseFloat(minPrice);
  const maxPriceNum = parseFloat(maxPrice);
  const isMinPriceValid = !isNaN(minPriceNum);
  const isMaxPriceValid = !isNaN(maxPriceNum);

  // Check if selected subcategory matches product's subcategory
  const isInSelectedSubCategory = selectedSubCategory 
    ? product.category.subCategory === selectedSubCategory 
    : true;

  // Ensure variants is an array before using some
  const hasVariants = product.colors && product.colors.length > 0;

  const isPriceValid = hasVariants && product.colors.some(color => {
    return color.variants && color.variants.length > 0 && color.variants.some(variant => {
      const variantPrice = parseFloat(variant.price);
      return (!isMinPriceValid || variantPrice >= minPriceNum) &&
             (!isMaxPriceValid || variantPrice <= maxPriceNum);
    });
  });

  // const inTags = selectedTags.length === 0 || selectedTags.some(tag => product.tags.includes(tag));
  const inTags = selectedTags ? product.tags === selectedTags : true;


  return isInSelectedSubCategory && isPriceValid && inTags;;
});

const sortProducts = (products) => {
  switch (sortBy) {
    case 'Alphabetically A-Z':
      return products.sort((a, b) => a.name.localeCompare(b.name));
    case 'Alphabetically Z-A':
      return products.sort((a, b) => b.name.localeCompare(a.name));
    case 'Newly Product':
      return products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case 'Price Lowest to Highest':
      return products.sort((a, b) => {
        const priceA = Math.min(...a.colors.map(color => Math.min(...color.variants.map(variant => variant.price))));
        const priceB = Math.min(...b.colors.map(color => Math.min(...color.variants.map(variant => variant.price))));
        return priceA - priceB;
      });
    case 'Price Highest to Lowest':
      return products.sort((a, b) => {
        const priceA = Math.max(...a.colors.map(color => Math.max(...color.variants.map(variant => variant.price))));
        const priceB = Math.max(...b.colors.map(color => Math.max(...color.variants.map(variant => variant.price))));
        return priceB - priceA;
      });
    case 'Highest Ratings':
      return products.sort((a, b) => b.totalRatings - a.totalRatings);
    case 'Lowest Ratings':
      return products.sort((a, b) => a.totalRatings - b.totalRatings);
    default:
      return products;
  }
};


const handleReset=(e)=>{
  e.preventDefault();
  setMinPrice(''),
  setMaxPrice(''),
  setSelectedSubCategory('');
  setSelectedTags('');
}

const sortedProducts = sortProducts(filteredProducts);
  
  return (
    <Container maxWidth="xl">
      <Box>
        <Typography
          sx={{
            textAlign: "center",
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "salmon",
          }}
        >
          {" "}
          Our Store
        </Typography>

        <Grid2 container>
          <Grid2 size={{ xs: 3, md: 3 }}>
            <Box
              sx={{
                backgroundColor: "#fff",
                padding: 2,
                borderRadius: 3,
                marginBottom: 1,
              }}
            >
             
              <Typography variant="subtitle2" sx={{ fontWeight: 500, pb: 1 }}>
                Shop By Category
              </Typography>

              <Stack sx={{ padding: 2 }} direction="row" flexWrap="wrap">
                <Typography sx={{ fontSize: 12, fontWeight: 500,cursor: 'pointer' ,color:'red',backgroundColor: "#f0f0f0",
                  paddingX: 2,
                  paddingY: 0.4,
                  borderRadius: 1,
                  margin:1,}} onClick={(e)=>handleReset(e)}>Reset</Typography>
              {categories.map((category)=>(
                <Typography sx={{ fontSize: 12,
                  fontWeight: 500,
                  backgroundColor: "#f0f0f0",
                  paddingX: 2,
                  paddingY: 0.4,
                  borderRadius: 1,
                  margin:1,
                  cursor: 'pointer' }} key={category._id} onClick={() => handleSubCategoryClick(category.subCategory)}>
                 {category.subCategory}
               </Typography>
              ))}
              </Stack>
            </Box>
            <Box sx={{ backgroundColor: "#fff", padding: 2, borderRadius: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 500, pb: 1 }}>
                Filter By
              </Typography>
              <Stack spacing={1}>
                <Stack>
                  <Typography
                    sx={{ fontSize: 12, fontWeight: 500, padding: 1 }}
                  >
                    Availablity
                  </Typography>
                </Stack>
                <Stack paddingX={3}>
                  <FormGroup sx={{ fontSize: 14 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          defaultChecked
                          sx={{
                            "& .MuiSvgIcon-root": { fontSize: 18 }, // Adjust the size of the checkbox icon
                          }}
                        />
                      }
                      label="In Stock"
                      sx={{
                        "& .MuiFormControlLabel-label": { fontSize: 13 }, // Adjust the font size of the label
                      }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{
                            "& .MuiSvgIcon-root": { fontSize: 18 }, // Adjust the size of the checkbox icon
                          }}
                        />
                      }
                      label="Out Of Stock"
                      sx={{
                        "& .MuiFormControlLabel-label": { fontSize: 13 }, // Adjust the font size of the label
                      }}
                    />
                  </FormGroup>
                </Stack>

                <Stack>
                  <Typography
                    sx={{ fontSize: 12, fontWeight: 500, padding: 1 }}
                  >
                    Price Range
                  </Typography>
                </Stack>
                <Stack sx={{paddingX:3}}>
                <Typography sx={{ fontSize: 12, fontWeight: 500,cursor: 'pointer' ,color:'red'}} onClick={(e)=>handleReset(e)}>Reset</Typography>
                </Stack>
                <Stack
                  paddingX={3}
                  direction={"row"}
                  alignItems={"center"}
                  spacing={2}
                >
                  <TextField
                    placeholder="Min"
                    value={minPrice}
                    onChange={handleMinPriceChange}
                    sx={{
                      width: 110, // Sets the width of the TextField
                      "& .MuiInputBase-root": {
                        height: 30, // Controls the height of the input area
                        fontSize: 12, // Optional: Adjust the font size
                      },
                    }}
                  />

                  <Typography>-</Typography>
                  <TextField
                    placeholder="Max"
                    value={maxPrice}
          onChange={handleMaxPriceChange}
                    sx={{
                      width: 110,
                      "& .MuiInputBase-root": { height: 30, fontSize: 12 },
                    }}
                  />
                </Stack>

                {/* <Stack>
                  <Typography
                    sx={{ fontSize: 12, fontWeight: 500, padding: 1 }}
                  >
                    Size
                  </Typography>
                </Stack>
                <Stack paddingX={3}>
                  <FormGroup sx={{ fontSize: 14 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          defaultChecked
                          sx={{
                            "& .MuiSvgIcon-root": { fontSize: 18 }, // Adjust the size of the checkbox icon
                          }}
                        />
                      }
                      label="12GB + 128GB"
                      sx={{
                        "& .MuiFormControlLabel-label": { fontSize: 13 }, // Adjust the font size of the label
                      }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{
                            "& .MuiSvgIcon-root": { fontSize: 18 }, // Adjust the size of the checkbox icon
                          }}
                        />
                      }
                      label="8GB + 10GB"
                      sx={{
                        "& .MuiFormControlLabel-label": { fontSize: 13 }, // Adjust the font size of the label
                      }}
                    />
                    <FormControlLabel
                    multiple="true"
                      control={
                        <Checkbox
                          sx={{
                            "& .MuiSvgIcon-root": { fontSize: 18 }, // Adjust the size of the checkbox icon
                          }}
                        />
                      }
                      label="M"
                      sx={{
                        "& .MuiFormControlLabel-label": { fontSize: 13 }, // Adjust the font size of the label
                      }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{
                            "& .MuiSvgIcon-root": { fontSize: 18 }, // Adjust the size of the checkbox icon
                          }}
                        />
                      }
                      label="XL"
                      sx={{
                        "& .MuiFormControlLabel-label": { fontSize: 13 }, // Adjust the font size of the label
                      }}
                    />
                  </FormGroup>
                </Stack> */}
              </Stack>
            </Box>

            <Box
              sx={{
                backgroundColor: "#fff",
                padding: 2,
                borderRadius: 3,
                marginTop: 1,
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 500, pb: 1 }}>
                Product Tags
              </Typography>
              <Stack sx={{ padding: 1 }} direction="row" flexWrap="wrap">
                  <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 500,
                    backgroundColor: "#f0f0f0",
                    paddingX: 2,
                    paddingY: 0.4,
                    borderRadius: 1,
                    margin: 1, // Adds margin around each item
                    cursor: 'pointer'
                  }}
                  onClick={(e) => handleTagChange('Normal', e)}
                >
                 Normal
                </Typography>

                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 500,
                    backgroundColor: "#f0f0f0",
                    paddingX: 2,
                    paddingY: 0.4,
                    borderRadius: 1,
                    margin: 1, // Adds margin around each item
                    cursor: 'pointer'
                  }}
                  onClick={(e) => handleTagChange('Hot', e)}
                >
                  Hot
                </Typography>
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 500,
                    backgroundColor: "#f0f0f0",
                    paddingX: 2,
                    paddingY: 0.4,
                    borderRadius: 1,
                    margin: 1, // Adds margin around each item
                    cursor: 'pointer'
                  }}
                  onClick={(e) => handleTagChange('Trending', e)}
                >
                  Trending
                </Typography>
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 500,
                    backgroundColor: "#f0f0f0",
                    paddingX: 2,
                    paddingY: 0.4,
                    borderRadius: 1,
                    margin: 1, // Adds margin around each item
                    cursor: 'pointer'
                  }}
                  onClick={(e) => handleTagChange('Sale', e)}
                >
                  Sale
                </Typography>
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 500,
                    backgroundColor: "#f0f0f0",
                    paddingX: 2,
                    paddingY: 0.4,
                    borderRadius: 1,
                    margin: 1, // Adds margin around each item
                    cursor: 'pointer'
                  }}
                  onClick={(e) => handleTagChange('Featured', e)}
                >
                  Featured
                </Typography>

                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 500,
                    backgroundColor: "#f0f0f0",
                    paddingX: 2,
                    paddingY: 0.4,
                    borderRadius: 1,
                    margin: 1, // Adds margin around each item
                    value:'Featured',
                    color:'red',
                    cursor: 'pointer'
                  }}
                  onClick={(e)=>handleReset(e)}
                >
                  Reset
                </Typography>
              </Stack>
            </Box>

            <Box
              sx={{
                backgroundColor: "#fff",
                padding: 2,
                borderRadius: 3,
                marginTop: 1,
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 500, pb: 1 }}>
                Top Selling Products
              </Typography>
              <Stack></Stack>
            </Box>
          </Grid2>
          <Grid2 size={{ xs: 9, md: 9 }}>
            <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between',backgroundColor:'#fff',padding:1,borderRadius:2,ml:1,height:50,pb:2}}>
               <Stack sx={{mt:1.5}} direction={'row'}alignItems={'center'} spacing={1}>
                <div>
                <FormControl
  sx={{
    m: 1,
    width: 250,
    '& .MuiInputLabel-root': {
      transform: 'translateY(-12px)', // Adjust the label position if needed
    },
  }}
>
  <InputLabel
    id="demo-multiple-name-label"
    sx={{
      backgroundColor: 'white', // Ensures label has a background color to avoid overlap // Adds padding around the label text
    }}
  >
    Sort By
  </InputLabel>
  <Select
    labelId="demo-multiple-name-label"
    id="demo-multiple-name"
    value={sortBy}
    onChange={handleChangeSorting}
    input={<OutlinedInput label="Sort By" />}
    MenuProps={MenuProps}
    sx={{
      height: 40, // Adjust the height here
      '& .MuiSelect-select': {
        display: 'flex',
        alignItems: 'center',
        paddingTop: '8px', // Ensure content is aligned properly
        height: '100%', // Full height for the select area
      },
    }}
  >
    {names.map((name) => (
      <MenuItem key={name} value={name} style={getStyles(name, personName, theme)}>
        {name}
      </MenuItem>
    ))}
  </Select>
</FormControl>


    </div>
               </Stack>
               <Stack direction='row' alignItems='center' spacing={1}>
        <Typography sx={{ fontSize: 12, fontWeight: 500 }}>{AllProductLength} Products</Typography>
        <Stack direction='row' alignItems='center' spacing={1} sx={{ paddingTop: 3 }}>
          <IconButton sx={{ boxShadow: 'none', pb: 0, mb: 0 }} onClick={() => handleSizeChange(6)}>
            <DensityLarge />
          </IconButton>
          <IconButton sx={{ boxShadow: 'none', pb: 0, mb: 0 }} onClick={() => handleSizeChange(4)}>
            <DensityMedium />
          </IconButton>
          <IconButton sx={{ boxShadow: 'none', pb: 0, mb: 0 }} onClick={() => handleSizeChange(3)}>
            <DensitySmall />
          </IconButton>
        </Stack>
        </Stack>
            </Box>

<Box sx={{
          padding: 1,
          height: '90vh',
          overflowY: 'scroll',
          '&::-webkit-scrollbar': {
            width: '5px',
            backgroundColor: 'transparent', // Invisible by default
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 255, 255, 0.5)', // Semi-transparent color
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)', // Glass effect
            transition: 'background 0.3s ease', // Smooth transition
          },
          '&:hover::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 255, 255, 0.8)', // More visible on hover
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent', // Invisible track
          },
          '&:hover::-webkit-scrollbar': {
            backgroundColor: 'rgba(0, 0, 0, 0.1)', // Light background on hover
          },
        }}
      >
<StoreProduct size={size} products={sortedProducts} />
</Box>
 
          </Grid2>
        </Grid2>
      </Box>
    </Container>
  );
};

export default OurStore;

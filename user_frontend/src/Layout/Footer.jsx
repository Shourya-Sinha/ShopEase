import {
  Box,
  Button,
  Container,
  Grid2,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import FooterImg from "../assets/Images/footer.png";
import {
  Facebook,
  Instagram,
  LocalPostOffice,
  LocationOn,
  Phone,
  Twitter,
} from "@mui/icons-material";

const Footer = () => {
  return (
    <>
    <Container>
    <Box sx={{width:'100%',height:'200px',backgroundColor:'salmon',color:'#141414',position:'relative',top:70,borderRadius:3,}}> 
      <Box sx={{justifyContent:'space-between',display:'flex',padding:5}}>
        <Stack>
        <Typography sx={{fontSize:'3rem',fontWeight:700,fontFamily:'Roboto',textTransform:'uppercase',color:'#fff'}}>let's get started shopping .</Typography>
        <Typography sx={{fontSize:'1rem',fontWeight:500,fontFamily:'Roboto',textTransform:'capitalize',color:'#fff'}}>shopping made easy</Typography>
        </Stack>

      <Stack>       <Button sx={{paddingX:3,paddingY:2,backgroundColor:'#141414',color:'#fff'}}>CONTACT WITH US</Button>  </Stack>
      </Box>

              </Box>
    </Container>

      <Box
        sx={{
          backgroundImage: `url(${FooterImg})`, // Set the background image
          backgroundSize: "cover", // Adjusts the image size to cover the entire area
          backgroundPosition: "center", // Centers the background image
          backgroundRepeat: "no-repeat", // Prevents the image from repeating
          height: "400px", // Adjust the height as needed
          width: "100%", // Takes full width of its container
          backgroundColor: "#141414",
        }}
      >

        <Container maxWidth="lg" sx={{ paddingY: 10 }}>
          
          <Grid2 container spacing={3}>
            <Grid2 size={{ xs: 12, md: 3 }}>
              <Stack>
                <Typography
                  sx={{
                    fontSize: 44,
                    fontWeight: 700,
                    fontFamily: "Roboto",
                    color: "#fff",
                  }}
                >
                  ShopEase
                </Typography>
                <Typography
                  sx={{
                    textTransform: "capitalize",
                    textAlign: "justify",
                    fontWeight: 500,
                    color: "#bfbfbf",
                  }}
                >
                  Your one-stop destination for a seamless shopping experience,
                  offering a wide range of products at unbeatable prices.
                  Discover convenience, quality, and savings all in one place.
                </Typography>
              </Stack>
              <Stack direction={"row"} spacing={2} sx={{ paddingTop: 2 }}>
                <Facebook sx={{ color: "#FA8072" }} />
                <Twitter sx={{ color: "#FA8072" }} />
                <Instagram sx={{ color: "#FA8072" }} />
              </Stack>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 3 }}>
              <Typography
                pl={5}
                pt={2}
                sx={{
                  fontSize: 20,
                  fontWeight: 400,
                  textTransform: "uppercase",
                  color: "#fff",
                }}
              >
                Explore
              </Typography>
              <Stack sx={{ paddingLeft: 5, pt: 2 }} spacing={2}>
                <Typography sx={{ color: "#bfbfbf", cursor: "pointer" }}>
                  Home
                </Typography>
                <Typography sx={{ color: "#bfbfbf", cursor: "pointer" }}>
                  About
                </Typography>
                <Typography sx={{ color: "#bfbfbf", cursor: "pointer" }}>
                  Support
                </Typography>
                <Typography sx={{ color: "#bfbfbf", cursor: "pointer" }}>
                  Privacy Policy
                </Typography>
                <Typography sx={{ color: "#bfbfbf", cursor: "pointer" }}>
                  Help
                </Typography>
              </Stack>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 3 }}>
              <Typography
                pt={2}
                sx={{
                  fontSize: 20,
                  fontWeight: 400,
                  textTransform: "uppercase",
                  color: "#fff",
                }}
              >
                Contact
              </Typography>
              <Stack pt={2} spacing={3}>
                <Stack direction={"row"} spacing={2}>
                  <LocationOn sx={{ color: "#FA8072" }} />
                  <Typography sx={{ color: "#bfbfbf", cursor: "pointer" }}>
                    123 Main St, City, State, 12345
                  </Typography>
                </Stack>
                <Stack direction={"row"} spacing={2}>
                  <LocalPostOffice sx={{ color: "#FA8072" }} />
                  <Typography sx={{ color: "#bfbfbf", cursor: "pointer" }}>
                    info@shopease.com
                  </Typography>
                </Stack>
                <Stack direction={"row"} spacing={2}>
                  <Phone sx={{ color: "#FA8072" }} />
                  <Typography sx={{ color: "#bfbfbf", cursor: "pointer" }}>
                    +91 8967452389
                  </Typography>
                </Stack>
              </Stack>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 3 }}>
              <Typography
                pt={2}
                sx={{
                  fontSize: 20,
                  fontWeight: 400,
                  textTransform: "uppercase",
                  color: "#fff",
                }}
              >
                Newsletter
              </Typography>
              <Stack spacing={2} paddingTop={2}>
                <TextField
                  variant="outlined"
                  placeholder="Email Address"
                  fullWidth
                  InputProps={{
                    // Change to endAdornment to display the icon at the end
                    endAdornment: (
                      <InputAdornment position="end">
                        <LocalPostOffice
                          style={{
                            backgroundColor: "#FB383B",
                            borderRadius: "50%",
                            padding: "10px",
                          }}
                          sx={{ color: "#fff", fontSize: 22 }}
                        />
                      </InputAdornment>
                    ),
                    style: {
                      color: "#595959", // Text color
                    },
                  }}
                  sx={{
                    borderRadius: 3,
                    backgroundColor: "#000", // TextField background color
                    "& .MuiInputBase-input::placeholder": {
                      color: "#595959", // Placeholder color
                      opacity: 1, // Ensures the placeholder is not transparent
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#000", // Border color of the text field
                        border: "none",
                      },
                      "&:hover fieldset": {
                        borderColor: "#595959", // Border color on hover
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#595959", // Border color when focused
                      },
                    },
                  }}
                />
                <Typography sx={{ fontWeight: 400, color: "#bfbfbf" }}>
                  Sign up for our latest news & articles. we won't give you spam
                  mails.
                </Typography>
              </Stack>
            </Grid2>
          </Grid2>
        </Container>
      </Box>
    </>
  );
};

export default Footer;

import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import "./HeaderStyle.css";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Adb,
  LocalMall,
  Search,
  ShoppingBasket,
  ShoppingCart,
} from "@mui/icons-material";
import { Stack } from "phosphor-react";
import { Link } from "react-router-dom";
import MyLogo from '../assets/Images/dell.png';
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, resetAuthStateLogout } from "../Redux/Slices/AuthSlice";
import { filterProducts } from "../Redux/Slices/ProductSlice";

const pages = ["Products", "Pricing", "Blog"];

const settings = [
  { name: "Profile", path: "/profile" },
  { name: "My Order", path: "/myOrder" },
  { name: "Logout" },
];

const guestSettings = [
  { name: "Login", path: "/login" },
  { name: "Register", path: "/register" },
];

const HeaderLink = {
  textDecoration: "none",
  paddingLeft: 14,
};

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const dispatch = useDispatch();
  // const isLoggedIn = useSelector((state)=> state.auth);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const cartLength = useSelector((state)=>state.appData.cartData.items.length || 0);

  useEffect(() => {
    const handleScroll = () => {
      const header = document.getElementById("main-header");
      if (window.scrollY > 50) {
        header.classList.add("scrolled");
        setIsScrolled(window.scrollY > 80);
      } else {
        header.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      // Handle component rerendering logic here if necessary
    }
  }, [isLoggedIn]);
  
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async() => {
    try {
      //  await dispatch(logoutUser());
      dispatch(resetAuthStateLogout());
    } catch (error) {
      dispatch(resetAuthStateLogout());
    }
  }

  const handleSearch = (event) => {
    const searchValue = event.target.value;
    dispatch(filterProducts(searchValue));
};
  return (
    <>
      <Box sx={{ height: "35px" }}>
        <AppBar
          id="main-header"
          sx={{ backgroundColor: "transparent", boxShadow: "none" }}
        >
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Box>
                <img src={MyLogo} alt="my Logo" height={50} width={50} style={{objectFit:'contain',paddingTop: isScrolled ? 8:25}} />
              </Box>

              <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                  sx={{position: isScrolled ? 'relative' :'relative',top: isScrolled ? 22:35}}
                >
                  <MenuIcon sx={{color:isScrolled ? '' :'#254000'}}  />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{ display: { xs: "block", md: "none" } }}
                >
                  {pages.map((page) => (
                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                      <Typography sx={{ textAlign: "center" }}>
                        {page}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
              <Adb sx={{ display: { xs: "flex", md: "none" }, mr: 1,color: isScrolled ? "#fff" : "#254000",paddingTop: isScrolled ? "" : "28px" }} />
              <Typography
                variant="h5"
                noWrap
                component="a"
                href="#app-bar-with-responsive-menu"
                sx={{
                  mr: 2,
                  display: { xs: "flex", md: "none" },
                  flexGrow: 1,
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                  color: isScrolled ? "#fff" : "#254000",
                  paddingTop: isScrolled ? "" : "28px",
                }}
              >
                LOGO
              </Typography>
              <Box
                sx={{
                  flexGrow: 1,
                  display: {
                    xs: "none",
                    md: "flex",
                    paddingTop: isScrolled ? "" : "28px",
                  },
                }}
              >
                <Link
                  to="/"
                  style={{
                    color: isScrolled ? "white" : "#254000",
                    textDecoration: "none",
                    paddingLeft: 14,
                  }}
                >
                  Home
                </Link>
                <Link
                  to="/contact"
                  style={{
                    color: isScrolled ? "white" : "#254000",
                    textDecoration: "none",
                    paddingLeft: 14,
                  }}
                >
                  Contact
                </Link>
                <Link
                  to="/store"
                  style={{
                    color: isScrolled ? "white" : "#254000",
                    textDecoration: "none",
                    paddingLeft: 14,
                  }}
                >
                  Our Store
                </Link>
                <Link
                  to="/cart"
                  style={{
                    color: isScrolled ? "white" : "#254000",
                    textDecoration: "none",
                    paddingLeft: 14,
                  }}
                >
                  Cart
                </Link>
              </Box>
              <Box
                sx={{
                  flexGrow: 0,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginRight: 1,
                  paddingTop: isScrolled ? "" : 4,
                }}
              >
                <TextField
                  variant="outlined"
                  placeholder="Search..."
                  size="small"
                  onChange={handleSearch}
                  sx={{
                    width: "300px", // Set the desired width of the search bar
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "20px", // Rounded corners
                      backgroundColor: isScrolled ? "#f0f0f0" : "#d9d9d9", // Light background color
                      paddingRight: 0, // Removes default right padding
                      "& fieldset": {
                        borderColor: "#ccc", // Border color
                      },
                      "&:hover fieldset": {
                        borderColor: "#888", // Border color on hover
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#1976d2", // Border color when focused
                      },
                    },
                    paddingRight: "12px",
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        sx={{ top: 20, position: "relative" }}
                      >
                        <IconButton>
                          <Search sx={{ color: isScrolled ? "" : "#595959" }} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Tooltip title="Open settings">
                  <IconButton
                    onClick={handleOpenUserMenu}
                    sx={{ p: 0, position: "relative", top: 20 }}
                  >
                    <Avatar
                      alt="Remy Sharp"
                      src="/static/images/avatar/2.jpg"
                    />
                  </IconButton>
                </Tooltip>
  <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {(isLoggedIn ? settings : guestSettings).map((setting) => (
                    <MenuItem
                      key={setting.name}
                      onClick={() => {
                        handleCloseUserMenu();
                        if (setting.name === "Logout") {
                          handleLogout();
                        }
                      }}
                    >
                      <Link
                        to={setting.path || "#"}
                        style={{
                          textDecoration: "none",
                          color: "inherit",
                        }}
                      >
                        <Typography sx={{ textAlign: "center" }}>{setting.name}</Typography>
                      </Link>
                    </MenuItem>
                  ))}
                </Menu>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    paddingLeft: 1,
                  }}
                >
                  <Link to={'/cart'} >
                  <ShoppingCart
                    sx={{ fontSize: 35, color: isScrolled ? "#fff" : "#254000" }}
                  />
                  </Link>
                  
                  <Box sx={{ position: "relative", top: -7, right: 20 }}>
                    <Typography
                      sx={{
                        mb: 0,
                        color: isScrolled ? "#000" : "#fff",
                        fontSize: 12,
                      }}
                    >
                      {cartLength}
                    </Typography>
                  </Box>
                  <Link
                    to={"/cart"}
                    style={{
                      textDecoration: "none",
                      color: isScrolled ? "#fff" : "#254000",
                      fontSize: 12,
                      paddingTop: 5,
                      position: "relative",
                      right: 10,
                    }}
                  >
                    Cart
                  </Link>
                </Box>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </Box>
    </>
  );
};

export default Header;

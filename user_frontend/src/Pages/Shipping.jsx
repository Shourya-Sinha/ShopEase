import {
  Badge,
  Box,
  Button,
  Collapse,
  Container,
  FormControl,
  FormControlLabel,
  Grid2,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import BreadCrimbs from "../Components/BreadCrimbs";
import { ChevronLeft, ExpandMore } from "@mui/icons-material";
import CartSmallProductComp from "../Components/CartSmallProductComp";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  getMyAddress,
  makeDEfaultAddress,
  setDefaultAddressId,
} from "../Redux/Slices/ProductSlice";

const Shipping = () => {
  const [expanded, setExpanded] = useState(false);
  const [expand1, setExpand1] = useState(false);
  const allAddress = useSelector((state) => state.appData.myAddress || []);
  const { isLoading, error } = useSelector((state) => state.appData.isLoading);
  const userId = useSelector((state) => state.auth.user);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const defaultAddressId = useSelector(
    (state) => state.appData.defaultAddressId
  );
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNo: "",
    alternateNo: "",
    address: "",
    nearby: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    isDefault: false,
    user: userId,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleExpandClick1 = () => {
    setExpand1(!expand1);
  };

  useEffect(() => {
    dispatch(getMyAddress());
  }, [dispatch]);

  useEffect(() => {
    if (allAddress.length > 0 && selectedAddressId === "") {
      const defaultAddress = allAddress.find((address) => address.isDefault);

      if (defaultAddress) {
        setSelectedAddressId(defaultAddress._id);
        dispatch(setDefaultAddressId(defaultAddress._id)); // Ensure correct dispatch
      } else {
        setSelectedAddressId(allAddress[0]._id);
        dispatch(setDefaultAddressId(allAddress[0]._id)); // Update fallback address
      }
    }
  }, [allAddress, selectedAddressId, dispatch]);

  const handleSubmit = async () => {
    // Prepare the data to be dispatched to addNewAddress thunk
    const data = {
      ...formData,
      shippingAddress: {
        fullName: formData.fullName,
        email: formData.email,
        phoneNo: formData.phoneNo,
        alternateNo: formData.alternateNo,
        address: formData.address,
      },
    };
    dispatch(addNewAddress(data));
  };

  const handlemakeDefaultAddress = (addressId) => {
    // Dispatch action to update the default address in backend and Redux
    dispatch(makeDEfaultAddress(addressId))
      .unwrap() // Wait for the API call to complete
      .then(() => {
        dispatch(setDefaultAddressId(addressId)); // Update Redux after successful API call
      })
      .catch((error) => {
        console.error("Failed to set default address", error);
      });
  };

  if (!Array.isArray(allAddress)) {
    return <div>No addresses found OR Loading...</div>; // or some fallback UI
  }
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
            Shipping & Address
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
                    Select Available Address
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
                {allAddress.map((address) => (
                  <Collapse
                    in={expanded}
                    timeout="auto"
                    unmountOnExit
                    sx={{ border: "1px solid salmon", borderRadius: 2 }}
                    key={address._id}
                  >
                    <Box sx={{ marginTop: 1, paddingX: 2, marginBottom: 1 }}>
                      <RadioGroup
                        name="address"
                        value={selectedAddressId} // Keep track of the selected address ID in state
                        onChange={(e) => {
                          const addressId = e.target.value;
                          setSelectedAddressId(addressId); // Set the selected address ID in local state
                          handlemakeDefaultAddress(address._id); // Call the function to make it the default
                        }}
                      >
                        <FormControlLabel
                          value={address._id}
                          control={<Radio />}
                          label={`${address.shippingAddress.fullName}, ${address.address}, ${address.apartment}, ${address.city}`}
                        />
                      </RadioGroup>
                    </Box>
                  </Collapse>
                ))}

                <Stack
                  direction={"row"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
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
                    Add New Address
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
                <Collapse
                  in={expand1}
                  timeout="auto"
                  unmountOnExit
                  sx={{ border: "1px solid salmon", borderRadius: 2 }}
                >
                  <Box sx={{ marginTop: 2, paddingX: 2 }}>
                    <Stack spacing={2}>
                      <TextField
                        fullWidth
                        placeholder="Enter Full Name"
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                      />
                      <TextField
                        fullWidth
                        placeholder="Enter Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                      <Stack direction={"row"} spacing={1}>
                        <TextField
                          fullWidth
                          placeholder="Enter PhoneNo"
                          type="tel"
                          name="phoneNo"
                          value={formData.phoneNo}
                          onChange={handleChange}
                        />
                        <TextField
                          fullWidth
                          placeholder="Enter Alternate No"
                          type="tel"
                          name="alternateNo"
                          value={formData.alternateNo}
                          onChange={handleChange}
                        />
                      </Stack>
                      <TextField
                        fullWidth
                        placeholder="Enter Address"
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                      />
                      <Stack direction={"row"} spacing={1}>
                        <TextField
                          fullWidth
                          placeholder="NearBy"
                          type="text"
                          name="nearby"
                          value={formData.nearby}
                          onChange={handleChange}
                        />
                        <TextField
                          fullWidth
                          placeholder="House/Apartment/Suit No."
                          type="text"
                          name="apartment"
                          value={formData.apartment}
                          onChange={handleChange}
                        />
                      </Stack>
                      <Stack direction={"row"} spacing={1}>
                        <TextField
                          fullWidth
                          placeholder="Enter City"
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                        />
                        <TextField
                          fullWidth
                          placeholder="Enter City"
                          type="text"
                          name="country" // The placeholder here should say 'Enter Country'
                          value={formData.country}
                          onChange={handleChange}
                        />
                        <TextField
                          fullWidth
                          placeholder="Enter State"
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                        />
                        <TextField
                          fullWidth
                          placeholder="ZipCode"
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                        />
                      </Stack>

                      {/* Default Address Selector */}
                      <FormControl fullWidth>
                        <InputLabel id="is-default-label">
                          Set as Default
                        </InputLabel>
                        <Select
                          labelId="is-default-label"
                          name="isDefault"
                          value={formData.isDefault ? "true" : "false"}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              isDefault: e.target.value === "true",
                            })
                          }
                        >
                          <MenuItem value="false">No</MenuItem>
                          <MenuItem value="true">Yes</MenuItem>
                        </Select>
                      </FormControl>

                      <Stack paddingTop={2}>
                        <Button sx={{ color: "salmon" }} onClick={handleSubmit}>
                          {isLoading ? "Adding Address..." : "Add Address"}
                        </Button>
                      </Stack>
                    </Stack>
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
                    border: "1px solid salmon",
                    borderRadius: 2,
                    paddingY: 1,
                    marginTop: 3,
                  }}
                >
                  <Link
                    to={"/payment"}
                    style={{ textDecoration: "none", color: "salmon" }}
                  >
                    Go To Payment
                  </Link>
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

export default Shipping;

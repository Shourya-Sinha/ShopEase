import { Box, Button, Grid2, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import ThirdImage from "../assets/Images/iqoo12sec.webp";
import ReactStars from "react-stars";
import { Link } from "react-router-dom";

const DealsProduct = ({products}) => {
  const [time, setTime] = useState({
    days: 123,
    hours: 18,
    minutes: 45,
    seconds: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => {
        const { days, hours, minutes, seconds } = prevTime;

        if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
          clearInterval(timer); // Stop the countdown when it reaches zero
          return prevTime; // Return the final state
        }

        // Decrement seconds and handle overflow
        let newSeconds = seconds - 1;
        let newMinutes = minutes;
        let newHours = hours;
        let newDays = days;

        if (newSeconds < 0) {
          newSeconds = 59;
          newMinutes--;

          if (newMinutes < 0) {
            newMinutes = 59;
            newHours--;

            if (newHours < 0) {
              newHours = 23;
              newDays--;

              if (newDays < 0) {
                newDays = 0;
              }
            }
          }
        }

        return {
          days: newDays,
          hours: newHours,
          minutes: newMinutes,
          seconds: newSeconds,
        };
      });
    }, 1000); // Decrease every second

    return () => clearInterval(timer); // Cleanup on component unmount
  }, []);
  return (
    <>
    <Grid2 container spacing={2}>
    {products.map((product)=>(
      <Grid2 size={{ xs: 12, md: 6 }} key={product._id}>
      <Box sx={{ border: "1px solid #d9d9d9", borderRadius: 3, padding: 2 }}>
      <Grid2 container>
        <Grid2 size={{ xs: 6, md: 6 }}>
          <Box paddingRight={"17px"} paddingTop={"2px"}>
            <img
              src={product.colors?.[0]?.images?.[0]?.secure_url || 'nothing'}
              alt="Product Image"
              style={{
                width: "250px",
                height: "259px",
                objectFit: "contain",
              }}
            />
            <Box sx={{ display: "flex", justifyContent: "center" ,marginTop:3}}>
              <Button
                sx={{
                  backgroundColor: "salmon",
                  color: "#fff",
                  fontWeight: 700,
                  paddingX: 2,
                  borderRadius: 2.5,
                }}
              >
                <Link to={`/product/${product._id}`} style={{textDecoration:'none',color:'#fff'}}>
                VIEW DETAILS
                </Link>
                
              </Button>
            </Box>
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 6, md: 6 }}>
          <Box>
            <ReactStars
              value={products.averageRating}
              edit={false}
              size={20}
              color={"#254000"}
            />
            <Typography
              sx={{
                fontSize: "0.875rem",
                textTransform: "uppercase",
                fontWeight: "700",
                color: "#1f1f1f",
              }}
            >
              {product.name}
            </Typography>
            <Typography
              sx={{
                fontSize: "0.875rem",
                fontWeight: 400, // Adjusted to valid value, '0.75rem' was incorrect
                color: "#595959",
                textAlign: "justify",
                display: "-webkit-box",
                WebkitLineClamp: 3, // Number of lines to show
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                width: "100%", // Adjust width as needed
                paddingTop: 1,
              }}
            >
              {product.description}
            </Typography>
            <Stack
              direction={"row"}
              paddingTop={1}
              spacing={2}
              paddingBottom={1}
            >
              <Typography sx={{ fontWeight: 700, color: "salmon" }}>
                &#8377; {product.colors?.[0]?.variants?.[0]?.price}
              </Typography>
              <Typography
                sx={{
                  fontWeight: "500",
                  color: "#595959",
                  fontSize: 14,
                  textDecoration: "line-through",
                }}
              >
                &#8377; 812.56{" "}
              </Typography>
            </Stack>
            <Stack paddingBottom={1}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Stack direction={"row"} alignItems={"center"}>
                  <Typography
                    sx={{ fontWeight: 400, color: "#1f1f1f", fontSize: 12 }}
                  >
                    ALREADY SOLD:
                  </Typography>
                  <Typography
                    sx={{ fontWeight: 700, color: "#000", fontSize: 13 }}
                  >
                    {product.sold}
                  </Typography>
                </Stack>
                <Stack
                  direction={"row"}
                  alignItems={"center"}
                  paddingBottom={1}
                >
                  <Typography
                    sx={{ fontWeight: 400, color: "#1f1f1f", fontSize: 12 }}
                  >
                    AVAILABLE:
                  </Typography>
                  <Typography
                    sx={{ fontWeight: 700, color: "#000", fontSize: 13 }}
                  >
                    {product.colors?.[0]?.variants?.[0]?.quantity || 0}
                  </Typography>
                </Stack>
              </Box>
              <Box
                sx={{
                  backgroundColor: "#bfbfbf",
                  borderRadius: 3,
                  height: "9px",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: 0.5,
                }}
              >
                <Box
                  sx={{
                    width: "35%",
                    backgroundColor: "salmon",
                    height: "5px",
                    borderRadius: 3,
                  }}
                ></Box>
              </Box>
              <Typography
                sx={{
                  fontWeight: "700",
                  fontSize: "0.775rem",
                  textTransform: "uppercase",
                  paddingTop: 2,
                }}
              >
                Hurry up! offer ends in:
              </Typography>
            </Stack>
            <Grid2 container spacing={1} paddingTop={1}>
              {["Day", "Hrs", "Min", "Sec"].map((label, index) => (
                <Grid2 key={label} xs={12} md={3}>
                  <Stack
                    direction={"column"}
                    sx={{
                      backgroundColor: "#d9d9d9",
                      borderRadius: 2,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 13,
                        fontWeight: 600,
                        lineHeight: 1.3,
                        paddingTop: 1,
                        paddingX: 2,
                      }}
                    >
                      {/* Display the corresponding time value */}
                      {index === 0
                        ? time.days
                        : index === 1
                        ? time.hours
                        : index === 2
                        ? time.minutes
                        : time.seconds}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 12,
                        color: "#262626",
                        lineHeight: 1,
                        paddingBottom: 1,
                      }}
                    >
                      {label}
                    </Typography>
                  </Stack>
                </Grid2>
              ))}
            </Grid2>
          </Box>
        </Grid2>
      </Grid2>
    </Box>
    </Grid2>
    ))}
</Grid2>
    </>
  );
};

export default DealsProduct;

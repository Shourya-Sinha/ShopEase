import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Stack,
  Container,
  Divider,
} from "@mui/material";
import FirstImage from "../assets/Images/alien.png";
import SecondImage from "../assets/Images/boat.png";
import ThirdImage from "../assets/Images/fashion.png";
import FirstLogo from "../assets/Images/alienlogo.png";
import SecondLogo from "../assets/Images/boatlogo.png";
import ThirdLogo from "../assets/Images/diamond.png";
import { ArrowCircleLeft, ArrowCircleRight } from "phosphor-react";

// Sample data
const images = [FirstImage, SecondImage, ThirdImage];

const content = [
  {
    title: "Best Gaming Laptop",
    description: "Good Laptop for Gamers, Best Speed under budget Price",
    icon: FirstLogo,
    brand: "AlienWare",
  },
  {
    title: "Under ₹1,499",
    description: "Budget friendly earbuds, headphone 7 more",
    icon: SecondLogo,
    brand: "Boat",
  },
  {
    title: "Starting ₹130",
    description: "Best and under Budget , fashion in your Hands",
    icon: ThirdLogo,
    brand: "Diamond",
  },
];

const HomeSlide = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        setIsTransitioning(false);
      }, 1000); // Duration of transition
    }, 8000); // Interval between transitions

    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      setIsTransitioning(false);
    }, 1000);
  };

  const handlePrevious = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + images.length) % images.length
      );
      setIsTransitioning(false);
    }, 1000);
  };
  const styles = {
    "@keyframes shine": {
      "0%": { backgroundPosition: "200% 10" },
      "50%": { backgroundPosition: "100% 0" },
      "100%": { backgroundPosition: "-200% 0" },
    },
  };
  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        height: "500px",
        background:
          "linear-gradient(135deg, #d9d9d9, #ffffff 20%, #d9d9d9 40%, #e0e0e0 60%, #d9d9d9 80%)",
        backgroundSize: "200% 200%",
        animation: "shine 5s infinite linear",
        ...styles, // Apply the keyframe animation styles
      }}
    >
      <Box
        className="firsdtGradient"
        sx={{ transform: "rotate3d(1, 1, 0, 120deg)" }}
      />
      <Box className="customeGradient" sx={{ right: 20, bottom: 20 }} />
      <Box
        className="customeGradient"
        sx={{ right: -70, width: 1, height: 1 }}
      />
      <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
        {images.map((img, index) => (
          <Container key={index} sx={{ position: "relative", top: "50%" }}>
            <Box
              key={index}
              sx={{
                position: "absolute",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                opacity:
                  index === currentIndex ||
                  (index === (currentIndex + 1) % images.length &&
                    isTransitioning)
                    ? 1
                    : 0,
                transform:
                  index === currentIndex
                    ? "scale(1)"
                    : index === (currentIndex + 1) % images.length &&
                      isTransitioning
                    ? "scale(1.05)"
                    : "scale(1)",
                transition: "opacity 1s ease-in-out, transform 1s ease-in-out",
                zIndex:
                  index === currentIndex ||
                  (index === (currentIndex + 1) % images.length &&
                    isTransitioning)
                    ? 2
                    : 1,
              }}
            >
              <Box sx={{ marginLeft: "20px", textAlign: "left" }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: 50,
                    fontFamily: "Alegreya",
                    background: content[index].title.includes("Laptop")
                      ? "linear-gradient(90deg, #00d0ff, #006aff)" // Gradient color for Alienware Laptop text (Blue shades)
                      : content[index].title.includes("₹1,499")
                      ? "linear-gradient(90deg, #ff6f61, #ff3d00)" // Gradient color for Boat text (Radish shades)
                      : "linear-gradient(90deg, #ff8a00, #e52e71)", // Gradient color for Clothes (Sunset shades)
                    WebkitBackgroundClip: "text", // Clip the background to the text
                    WebkitTextFillColor: "transparent", // Make text transparent to show background
                    paddingY: 0.57,
                  }}
                >
                  {content[index].title}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 500,
                    fontSize: 20,
                    color: "#8c8c8c",
                    background: content[index].title.includes("Laptop")
                      ? "linear-gradient(90deg, #00d0ff, #006aff)" // Gradient color for Alienware Laptop text (Blue shades)
                      : content[index].title.includes("₹1,499")
                      ? "linear-gradient(90deg, #ff6f61, #ff3d00)" // Gradient color for Boat text (Radish shades)
                      : "linear-gradient(90deg, #ff8a00, #e52e71)", // Gradient color for Clothes (Sunset shades)
                    WebkitBackgroundClip: "text", // Clip the background to the text
                    WebkitTextFillColor: "transparent",
                    paddingBottom: 2,
                  }}
                >
                  {content[index].description}
                </Typography>
                <Stack direction={"row"} spacing={3} alignItems={"center"}>
                  <img
                    src={content[index].icon}
                    style={{ height: 50, width: 50, objectFit: "contain" }}
                  />
                  <Divider orientation="vertical" sx={{ height: "50px" }} />
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: 20,
                      background: content[index].title.includes("Laptop")
                        ? "linear-gradient(90deg, #00d0ff, #006aff)" // Gradient color for Alienware Laptop text (Blue shades)
                        : content[index].title.includes("₹1,499")
                        ? "linear-gradient(90deg, #ff6f61, #ff3d00)" // Gradient color for Boat text (Radish shades)
                        : "linear-gradient(90deg, #ff8a00, #e52e71)", // Gradient color for Clothes (Sunset shades)
                      WebkitBackgroundClip: "text", // Clip the background to the text
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {content[index].brand}
                  </Typography>
                </Stack>
              </Box>
              <img
                src={img}
                alt={`Slide ${index + 1}`}
                style={{
                  maxWidth: "450px",
                  borderRadius: "8px",
                  objectFit: "contain",
                }}
              />
            </Box>
          </Container>
        ))}
      </Box>

      <Box
        sx={{
          position: "absolute",
          justifyContent: "space-between",
          display: "flex",
          flexDirection: "row",
          top: "50%",
          width: "100%",
        }}
      >
        <Stack sx={{ paddingLeft: 35 }}>
          <IconButton
            onClick={handlePrevious}
            color="primary"
            sx={{
              "&:hover": {
                animation: "rotateIcon 0.6s ease-in-out", // Apply rotation animation
              },
            }}
          >
            <ArrowCircleLeft />
          </IconButton>
        </Stack>

        <Stack sx={{ paddingRight: 35 }}>
          <IconButton
            onClick={handleNext}
            color="primary"
            sx={{
              "&:hover": {
                animation: "rotateIcon 0.6s ease-in-out", // Apply rotation animation
                transformOrigin: "center center", // Ensure rotation around the center
                display: "inline-flex", // Proper flex item behavior
                position: "relative", // Prevent any layout shift
                verticalAlign: "middle", // Align icon in the middle
              },
            }}
          >
            <ArrowCircleRight />
          </IconButton>
        </Stack>
      </Box>
    </Box>
  );
};

export default HomeSlide;

import { ChevronRight } from "@mui/icons-material";
import { Stack } from "@mui/material";
import React from "react";
import { Link, useLocation } from "react-router-dom";

const BreadCrimbs = () => {
  const location = useLocation(); // Get the current route

  // Define styles for active and disabled links
  const activeStyle = { textDecoration: "none", color: "salmon" };
  const disabledStyle = {
    textDecoration: "none",
    color: "grey",
    pointerEvents: "none",
  };

  // Determine the current path
  const currentPath = location.pathname;
  return (
    <Stack direction={"row"} spacing={0.5} marginBottom={"15px"}>
      {/* Home Link */}
      <Link
        to="/"
        style={{
          textDecoration: "none",
          ...(currentPath === "/" ? activeStyle : {}),
        }}
      >
        Home
      </Link>
      <ChevronRight />
      {/* Cart Link */}
      <Link
        to="/cart"
        style={{
          textDecoration: "none",
          ...(currentPath === "/cart"
            ? activeStyle
            : currentPath !== "/"
            ? {}
            : disabledStyle),
        }}
      >
        Cart
      </Link>
      <ChevronRight />
      {/* Shipping Link */}
      <Link
        to="/shipping"
        style={{
          textDecoration: "none",
          ...(currentPath === "/shipping"
            ? activeStyle
            : currentPath === "/cart" || currentPath === "/payment"
            ? {}
            : disabledStyle),
        }}
      >
        Shipping
      </Link>
      <ChevronRight />
      {/* Payment Link */}
      <Link
        to="/payment"
        style={{
          textDecoration: "none",
          ...(currentPath === "/payment"
            ? activeStyle
            : currentPath === "/shipping"
            ? {}
            : disabledStyle),
        }}
      >
        Payment
      </Link>
    </Stack>
  );
};

export default BreadCrimbs;

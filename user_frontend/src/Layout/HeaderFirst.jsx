import { KeyboardArrowDown, Wallet } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import { Phone } from "phosphor-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const HeaderFirst = () => {
  return (
    <>
      <Box sx={{ backgroundColor: "#254000", paddingX: 2, paddingY: 0.5 }}>
        <Box
          sx={{
            justifyContent: "space-between",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Stack direction={"row"} alignItems={"center"} spacing={2}>
            <Phone color="#fff" />
            <Typography
              variant="body2"
              sx={{ color: "#fff", fontWeight: "500", fontSize: 12 }}
            >
              +91 7845237856
            </Typography>
          </Stack>
          <Stack direction={"row"} alignItems={"center"} spacing={2}>
            <Typography
              variant="body2"
              sx={{ color: "#fff", fontWeight: "bold" }}
            >
              Get 50% Off on Selected Items
            </Typography>
            <Divider
              orientation="vertical"
              sx={{ height: "100%", backgroundColor: "#fff" }}
            />
            <Link
              style={{
                color: "#fff",
                textDecoration: "none",
                fontWeight: 500,
                fontSize: 12,
              }}
            >
              Shop Now{" "}
            </Link>
          </Stack>
          <Stack direction={"row"} alignItems={"center"} spacing={1}>
            <Wallet style={{ color: "#fff" }} />
            <Typography
              variant="body2"
              sx={{ fontWeight: "500", color: "#fff" }}
            >
              &#8377; 786.90
            </Typography>
          </Stack>
        </Box>
      </Box>
    </>
  );
};

export default HeaderFirst;

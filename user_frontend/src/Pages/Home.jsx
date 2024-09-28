import { Box } from "@mui/material";
import React from "react";
import HomeSlide from "../Components/HomeSlide";
import CategorySections from "../Components/Sections/CategorySections";
import Services from "../Components/Sections/Services";
import NewProducts from "../Components/Sections/NewProducts";
import TopTagged from "../Components/Sections/TopTagged";
import DealsDay from "../Components/Sections/DealsDay";

const Home = () => {
  return (
    <>
      <Box sx={{ width: "100%", minHeight: "100vh" }}>
        <HomeSlide />

        <section style={{ marginTop: 1 }}>
          <Services />
        </section>

        <section style={{ marginTop: 1 }}>
          <CategorySections />
        </section>

        <section style={{ marginTop: 1 }}>
          <NewProducts />
        </section>

        <section style={{ marginTop: 1 }}>
          <TopTagged />
        </section>

        <section style={{ marginTop: 1 }}>
          <DealsDay />
        </section>
      </Box>
    </>
  );
};

export default Home;




import Container from "@/components/Container";
import HomeBanner from "@/components/HomeBanner";
import HomeCategories from "@/components/HomeCategories";
import ProductGrid from "@/components/ProductGrid";
import AboutRestaurant from "@/components/AboutRestaurant"
import NewCollection from "@/components/NewCollection";
import { getNewCollectionProducts } from "@/sanity/queries/newCollection";
import FooterSection from "@/components/FooterSection";
import { getCategories } from "@/sanity/queries";
import React from "react";



const Home = async () => {
  const categories = await getCategories();
 const newProducts = await getNewCollectionProducts();



  return (
    <Container className="bg-shop-light-pink">

         <HomeBanner />
         <HomeCategories categories={categories} />
         <ProductGrid />
         <AboutRestaurant/>
         <NewCollection products={newProducts} />
 <FooterSection />

    </Container>
  );
};

export default Home;
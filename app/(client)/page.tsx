import Container from "../../components/Container";
import HomeCategories from "../../components/HomeCategories";
import ProductGrid from "../../components/ProductGrid";
import AboutRestaurant from "../../components/AboutRestaurant";
import NewCollection from "../../components/NewCollection";
import FooterSection from "../../components/FooterSection";
import HomeBanner from "../../components/HomeBanner";

import { getNewCollectionProducts } from "../../sanity/queries/newCollection";
import { getCategories } from "../../sanity/queries";

export default async function Home() {
  const categories = await getCategories();
  const newProducts = await getNewCollectionProducts();

  return (
    <Container className="bg-shop-light-pink">
      <HomeBanner />
      <HomeCategories categories={categories} />
      <ProductGrid />
      <AboutRestaurant />
      <NewCollection products={newProducts} />
      <FooterSection />
    </Container>
  );
}
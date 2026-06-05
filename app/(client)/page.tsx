
import Container from "../../components/Container";
import dynamic from "next/dynamic";

import HomeCategories from "../../components/HomeCategories";
import ProductGrid from "../../components/ProductGrid";
import AboutRestaurant from "../../components/AboutRestaurant";
import NewCollection from "../../components/NewCollection";
import FooterSection from "../../components/FooterSection";

import { getNewCollectionProducts } from "../../sanity/queries/newCollection";
import { getCategories } from "../../sanity/queries";

// 🔥 مهم: منع SSR للـ 3D
const HomeBanner = dynamic(() => import("../../components/HomeBanner"), {
  ssr: false,
});

const Home = async () => {
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
};

export default Home;
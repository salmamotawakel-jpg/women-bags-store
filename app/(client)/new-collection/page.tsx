

// app/(client)/new-collection/page.tsx
import Container from "@/components/Container";
import NewCollection from "@/components/NewCollection";
import { getNewCollectionProducts } from "@/sanity/queries/newCollection";

export const metadata = {
  title: "New Collection | Women Bag",
  description: "Discover our latest collection of crystal handbags",
};

const NewCollectionPage = async () => {
  const products = await getNewCollectionProducts();
  
  console.log("Products in page:", products); // للتأكد

  return (
    <Container className="py-8 md:py-12 min-h-screen">
      <NewCollection products={products} />
    </Container>
  );
};

export default NewCollectionPage;
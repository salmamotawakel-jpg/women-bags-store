// components/header/TopHeader.tsx
import Link from "next/link";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import Container from "./Container";
import MobileMenu from "./MobileMenu";
import CartIconWithBadge from "./CartIconWithBadge";

const Header = async () => {
  return (
    <>
      
      <header className="sticky top-0 z-50 bg-white border-b bg-white/70 backdrop-blur-md">
        <Container className="flex items-center justify-between text-lightColor">
          <div className="container flex h-14 items-center justify-between m-4">
            <MobileMenu />
            <Logo />
            <SearchBar />
            <CartIconWithBadge />
          </div>
        </Container>
      </header>
    </>
  );
};

export default Header;
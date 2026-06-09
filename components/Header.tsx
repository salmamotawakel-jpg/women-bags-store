


// components/header/TopHeader.tsx
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import Container from "./Container";
import MobileMenu from "./MobileMenu";
import CartIconWithBadge from "./CartIconWithBadge";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-5 bg-gradient-to-b from-white/60 to-green-800/30 backdrop-blur-xl shadow-sm">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <MobileMenu />
          <Logo />
          <SearchBar />
          <CartIconWithBadge />
        </div>
      </Container>
    </header>
  );
};

export default Header;
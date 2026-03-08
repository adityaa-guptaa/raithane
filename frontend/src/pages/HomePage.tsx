import HeroSection from "../components/HeroSection";
import TopCategories from "../components/TopCategories";
import NewProduct from "../components/NewProduct";
import PromoCards from "../components/PromoCards";
import NewArrival from "../components/NewArrival";
import FeaturedProduct from "../components/FeaturedProduct";
import ServiceHighlight from "../components/ServiceHighlight";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TopCategories />
      <NewProduct />
      <PromoCards />
      <NewArrival />
      <FeaturedProduct />
      <ServiceHighlight />
    </>
  );
}

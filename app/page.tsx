import HeroLanding from "@/components/home/HeroLanding";
import MostLikedBlogs from "@/components/home/MostLikedBlogs";
import MostRecentBlogs from "@/components/home/MostRecentBlogs";
import TopBlogCarousel from "@/components/home/TopBlogCarousel";

const Home = () => {
  return (
    <>
      <HeroLanding />
      <TopBlogCarousel />
      <MostRecentBlogs />
      <MostLikedBlogs />
    </>
  );
};

export default Home;

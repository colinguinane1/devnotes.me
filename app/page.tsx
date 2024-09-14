import CreatePost from "@/components/buttons/CreatePost";
import HeroLanding from "@/components/home/HeroLanding";
import MostLikedBlogs from "@/components/home/MostLikedBlogs";
import MostRecentBlogs from "@/components/home/MostRecentBlogs";
import TopAuthors from "@/components/home/TopAuthors";
import TopBlogCarousel from "@/components/home/TopBlogCarousel";

const Home = () => {
  return (
    <>
      <HeroLanding />
      <TopBlogCarousel />
      <CreatePost />
    </>
  );
};

export default Home;

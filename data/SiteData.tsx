import Image from "next/image";

export const NavigationData = [
  { name: "Home", href: "/" },
  { name: "Explore", href: "/explore" },
  { name: "Write", href: "/write" },
  { name: "Support", href: "/support" },
];
export const Logo = "<d/>";
export const siteName = "DevNotes";

export const defaultAvatar =
  "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F009%2F292%2F244%2Foriginal%2Fdefault-avatar-icon-of-social-media-user-vector.jpg&f=1&nofb=1&ipt=006767bb3b833d3cb8590d11f5c03a9e64ec2adf837953f627c67bdf8a29cf7e&ipo=images";

export function formatDate(dateString: Date | string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatCommentDate(dateString: Date | string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMins = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMins < 60) {
    return `${diffInMins} mins ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  } else if (diffInDays < 30) {
    return `${diffInDays} days ago`;
  } else {
    // Format as Day/Month/Year
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
}

export function generateSlug(title: string): string {
  const slug = title
    .toLowerCase() // Convert the title to lowercase
    .trim() // Remove whitespace from both ends
    .replace(/[^\w\s-]/g, "") // Remove all non-word characters except spaces and hyphens
    .replace(/\s+/g, "-"); // Replace spaces with hyphens

  // Generate a 4-digit random number
  const randomNumber = Math.floor(1000 + Math.random() * 9000); // Generates a random number between 1000 and 9999

  // Combine the slug and the random number
  return `${slug}-${randomNumber}`;
}

export function calculateReadingTime(content: string) {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
}

export function generateDescription(content: string): string {
  return content.length > 150 ? content.substring(0, 147) + "..." : content;
}

export const LogoSVG = () => (
  <Image
    src="/testlogo.svg"
    alt="logo"
    width={45}
    height={45}
    className="bg-primary rounded-lg shadow-2xl fill-white "
  ></Image>
);

export const siteVersion = "1.5.6";

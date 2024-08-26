import Image from "next/image";

export const NavigationData = [
  { name: "Home", href: "/" },
  { name: "Explore", href: "/explore" },
  { name: "Write", href: "/write" },
  { name: "Support", href: "/support" },
];
export const Logo = "<d/>";
export const siteName = "DevNotes";

export function formatDate(dateString: Date) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
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

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

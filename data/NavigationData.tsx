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

import { redirect } from "next/navigation";

// Any URL the site doesn't have (including unknown project/certificate slugs) goes to the sitemap
export default function NotFound() {
  redirect("/sitemap");
}

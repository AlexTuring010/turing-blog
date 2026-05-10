import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/Hero";
import { FeaturedPost } from "@/components/home/FeaturedPost";
import { RecentPosts } from "@/components/home/RecentPosts";
import { WorkStrip } from "@/components/home/WorkStrip";
import { AboutCard } from "@/components/home/AboutCard";
import { Newsletter } from "@/components/home/Newsletter";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <FeaturedPost />
      <RecentPosts />
      <WorkStrip />
      <AboutCard />
      <Newsletter />
    </>
  );
}

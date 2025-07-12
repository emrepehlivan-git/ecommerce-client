import { Metadata } from "next";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getI18n();
  return {
    title: t("profile.page.title"),
    description: t("profile.page.description"),
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL}/profile`,
    },
    keywords: t("profile.page.keywords").split(", "),
    openGraph: {
      title: t("profile.page.title"),
      description: t("profile.page.description"),
      type: "website",
      url: `${process.env.NEXT_PUBLIC_APP_URL}/profile`,
    },
  };
}

export default function ProfilePage() {
  return <div></div>;
}

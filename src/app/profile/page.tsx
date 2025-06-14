import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
  description: "Profile page",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL}/profile`,
  },
  keywords: ["profile", "user", "profile page"],
  openGraph: {
    title: "Profile",
    description: "Profile page",
    type: "website",
    url: `${process.env.NEXT_PUBLIC_APP_URL}/profile`,
  },
};

export default function ProfilePage() {
  return <div></div>;
}

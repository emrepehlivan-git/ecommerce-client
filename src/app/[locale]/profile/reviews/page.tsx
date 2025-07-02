import { getI18n } from "@/i18n/server";

export default async function ReviewsPage() {
  const t = await getI18n();
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">{t("profile.reviews.page.title")}</h2>
      <p>{t("profile.reviews.page.description")}</p>
    </div>
  );
}

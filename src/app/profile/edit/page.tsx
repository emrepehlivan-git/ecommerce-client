import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import EditForm from "@/components/profile/edit-form";

export default async function ProfileEditPage() {
  const session = await auth();
  const user = session?.user;

  if (!user) redirect("/");

  return (
    <div className="flex justify-center pt-5">
      <EditForm
        defaultValues={{
          name: user.name || "",
          email: user.email || "",
          phone: "",
          birthDate: user.birthDate?.toISOString() || "03.07.1994",
        }}
      />
    </div>
  );
}

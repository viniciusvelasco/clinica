import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ConfiguracoesForm } from "@/components/configuracoes/configuracoes-form";

export default async function ConfiguracoesPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }
  
  return <ConfiguracoesForm user={session.user} />;
} 
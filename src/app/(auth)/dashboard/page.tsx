import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">
        Bem-vindo, {session?.user?.name}
      </h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-card rounded-lg shadow-sm">
          <h2 className="font-semibold text-lg">Consultas Hoje</h2>
          <p className="text-3xl font-bold text-primary">8</p>
        </div>
        <div className="p-6 bg-card rounded-lg shadow-sm">
          <h2 className="font-semibold text-lg">Pacientes</h2>
          <p className="text-3xl font-bold text-secondary">127</p>
        </div>
        <div className="p-6 bg-card rounded-lg shadow-sm">
          <h2 className="font-semibold text-lg">Médicos</h2>
          <p className="text-3xl font-bold text-accent">12</p>
        </div>
        <div className="p-6 bg-card rounded-lg shadow-sm">
          <h2 className="font-semibold text-lg">Especialidades</h2>
          <p className="text-3xl font-bold text-muted-foreground">8</p>
        </div>
      </div>
    </div>
  );
} 
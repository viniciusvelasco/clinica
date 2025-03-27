"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  User,
  Key,
  Clock,
  Upload,
  Save,
  Loader2,
  RefreshCw,
  UserCircle,
  ShieldAlert,
  History,
} from "lucide-react";
import { toast } from "sonner";
import { getInitials } from "@/lib/utils";

interface HistoricoAcesso {
  id: string;
  userId: string;
  dataHora: Date | string;
  ip: string;
  browser: string;
  local: string;
}

interface PerfilClientProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  historico: HistoricoAcesso[];
}

// Componente client para a página de perfil
export function PerfilClient({ user, historico }: PerfilClientProps) {
  const { update } = useSession();
  
  const [nome, setNome] = useState(user?.name || "");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(user?.image || null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handlePhotoUpload = async () => {
    if (!photo) return;
    
    setLoadingPhoto(true);
    
    try {
      // Aqui seria feito o upload da foto para o servidor
      // const formData = new FormData();
      // formData.append('photo', photo);
      // const response = await fetch('/api/perfil/foto', { method: 'POST', body: formData });
      
      // Simulação de upload
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Foto atualizada", {
        description: "Sua foto de perfil foi atualizada com sucesso."
      });
      
      // Atualizar a sessão com a nova foto
      // await update({ image: response.url });
    } catch (error) {
      toast.error("Erro ao atualizar foto", {
        description: "Ocorreu um erro ao atualizar sua foto de perfil."
      });
    } finally {
      setLoadingPhoto(false);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    
    try {
      // Aqui seria feita a atualização do nome no servidor
      // await fetch('/api/perfil', { method: 'PUT', body: JSON.stringify({ name: nome }) });
      
      // Simulação de salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Atualizar a sessão com o novo nome
      await update({ name: nome });
      
      toast.success("Perfil atualizado", {
        description: "Seu perfil foi atualizado com sucesso."
      });
    } catch (error) {
      toast.error("Erro ao atualizar perfil", {
        description: "Ocorreu um erro ao atualizar seu perfil."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (novaSenha !== confirmarSenha) {
      toast.error("Senhas não conferem", {
        description: "A nova senha e a confirmação não são iguais."
      });
      return;
    }

    setLoading(true);
    
    try {
      // Aqui seria feita a alteração de senha no servidor
      // await fetch('/api/perfil/senha', { method: 'PUT', body: JSON.stringify({ currentPassword: senhaAtual, newPassword: novaSenha }) });
      
      // Simulação de alteração de senha
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Senha alterada", {
        description: "Sua senha foi alterada com sucesso."
      });
      
      // Limpar os campos de senha
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarSenha("");
    } catch (error) {
      toast.error("Erro ao alterar senha", {
        description: "Ocorreu um erro ao alterar sua senha."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Coluna da esquerda - Foto */}
        <Card className="border-primary/10">
          <CardHeader className="bg-primary/10 px-4 py-3 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Foto de Perfil
            </CardTitle>
            <CardDescription>Altere sua foto de perfil</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="h-32 w-32 border-4 border-primary/10 shadow-lg">
              <AvatarImage src={photoPreview || undefined} alt={user.name || ""} />
              <AvatarFallback className="text-2xl bg-primary/5">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            
            <div className="flex flex-col w-full max-w-xs">
              <Label htmlFor="picture" className="mb-2">Selecionar nova foto</Label>
              <Input
                id="picture"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="mb-4"
              />
              <Button 
                onClick={handlePhotoUpload} 
                disabled={!photo || loadingPhoto}
                className="w-full"
              >
                {loadingPhoto ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    <span>Enviar foto</span>
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Coluna central - Tabs para Dados e Senha */}
        <Card className="md:col-span-2 border-primary/10">
          <CardHeader className="bg-primary/10 px-4 py-3 rounded-t-lg">
            <CardTitle>Dados pessoais</CardTitle>
            <CardDescription>Altere seus dados ou senha de acesso</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="dados" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted rounded-lg">
                <TabsTrigger 
                  value="dados" 
                  className="rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=active]:font-medium flex items-center justify-center py-3 gap-2"
                >
                  <UserCircle className="h-5 w-5" />
                  Dados
                </TabsTrigger>
                <TabsTrigger 
                  value="senha" 
                  className="rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=active]:font-medium flex items-center justify-center py-3 gap-2"
                >
                  <ShieldAlert className="h-5 w-5" />
                  Senha
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="dados" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={user.email || ""}
                      disabled
                    />
                  </div>
                  <Button 
                    onClick={handleSaveProfile}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span>Salvando...</span>
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        <span>Salvar Alterações</span>
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="senha" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="current-password">Senha Atual</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={senhaAtual}
                      onChange={(e) => setSenhaAtual(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-password">Nova Senha</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={novaSenha}
                      onChange={(e) => setNovaSenha(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Confirmar Senha</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={handleChangePassword}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span>Alterando...</span>
                      </>
                    ) : (
                      <>
                        <Key className="mr-2 h-4 w-4" />
                        <span>Alterar Senha</span>
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        {/* Terceira coluna - Histórico de acessos (ocupa toda a largura em telas maiores) */}
        <Card className="md:col-span-3 border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-primary/10 px-4 py-3 rounded-t-lg">
            <div>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                Histórico de Acessos
              </CardTitle>
              <CardDescription>Seus últimos acessos ao sistema</CardDescription>
            </div>
            <Button variant="outline" size="icon" disabled>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-primary/10 overflow-hidden">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground tracking-wider">Data/Hora</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground tracking-wider">IP</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground tracking-wider">Navegador</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground tracking-wider">Local</th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {historico && historico.length > 0 ? (
                    historico.map((acesso) => (
                      <tr key={acesso.id}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {new Date(acesso.dataHora).toLocaleString('pt-BR')}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">{acesso.ip}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm truncate max-w-[200px]">
                          {acesso.browser}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">{acesso.local}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-3 text-center text-sm text-muted-foreground">
                        Nenhum acesso registrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Server Component - página de perfil
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { PerfilForm } from "@/components/perfil/perfil-form";

export default async function PerfilPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }
  
  // Carregar histórico de acesso no servidor diretamente do DB
  try {
    const historico = await db.historicoAcesso.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        dataHora: "desc",
      },
      take: 10, // Limitar aos 10 acessos mais recentes
    });
    
    return <PerfilForm user={session.user} historico={historico} />;
  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
    
    return <PerfilForm user={session.user} historico={[]} />;
  }
} 
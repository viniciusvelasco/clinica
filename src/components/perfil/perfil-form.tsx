"use client";

import { useState } from "react";
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

interface PerfilFormProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  historico: HistoricoAcesso[];
}

export function PerfilForm({ user, historico }: PerfilFormProps) {
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
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6 text-foreground">Meu Perfil</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Coluna da esquerda - Foto */}
        <Card className="border-primary/10 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="bg-primary/10 px-5 py-3 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4 text-primary" />
              Foto de Perfil
            </CardTitle>
            <CardDescription className="text-xs">Altere sua foto de perfil</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4 p-5">
            <div className="relative group">
              <Avatar className="h-28 w-28 border-4 border-primary/10 shadow-lg group-hover:border-primary/20 transition-all duration-200">
                <AvatarImage src={photoPreview || undefined} alt={user.name || ""} className="object-cover" />
                <AvatarFallback className="text-2xl font-semibold bg-primary/5">{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-full transition-all duration-200"></div>
            </div>
            
            <div className="flex flex-col w-full max-w-xs space-y-3">
              <Label htmlFor="picture" className="text-xs font-medium">Selecionar nova foto</Label>
              <Input
                id="picture"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="border-primary/20 focus-visible:ring-primary/30 h-9 text-sm"
              />
              <Button 
                onClick={handlePhotoUpload} 
                disabled={!photo || loadingPhoto}
                className="w-full mt-1 bg-primary hover:bg-primary/90 h-9 text-sm"
                size="sm"
              >
                {loadingPhoto ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-3 w-3" />
                    <span>Enviar foto</span>
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Coluna central - Tabs para Dados e Senha */}
        <Card className="md:col-span-2 border-primary/10 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="bg-primary/10 px-5 py-3 rounded-t-lg">
            <CardTitle className="text-base">Dados pessoais</CardTitle>
            <CardDescription className="text-xs">Altere seus dados ou senha de acesso</CardDescription>
          </CardHeader>
          <CardContent className="p-5">
            <Tabs defaultValue="dados" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted rounded-lg p-1 h-10">
                <TabsTrigger 
                  value="dados" 
                  className="rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=active]:font-medium flex items-center justify-center py-2 gap-2 transition-all duration-200 text-sm"
                >
                  <UserCircle className="h-4 w-4" />
                  Dados
                </TabsTrigger>
                <TabsTrigger 
                  value="senha" 
                  className="rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=active]:font-medium flex items-center justify-center py-2 gap-2 transition-all duration-200 text-sm"
                >
                  <ShieldAlert className="h-4 w-4" />
                  Senha
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="dados" className="space-y-4 animate-in fade-in-50 data-[state=active]:animate-in">
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs font-medium">Nome</Label>
                    <Input
                      id="name"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="border-primary/20 focus-visible:ring-primary/30 h-9 text-sm"
                      placeholder="Seu nome completo"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-medium">Email</Label>
                    <Input
                      id="email"
                      value={user.email || ""}
                      disabled
                      className="bg-muted cursor-not-allowed h-9 text-sm"
                    />
                    <p className="text-xs text-muted-foreground">O email não pode ser alterado.</p>
                  </div>
                  <Button 
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="mt-3 bg-primary hover:bg-primary/90 transition-colors h-9 text-sm"
                    size="sm"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        <span>Salvando...</span>
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-3 w-3" />
                        <span>Salvar Alterações</span>
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="senha" className="space-y-4 animate-in fade-in-50 data-[state=active]:animate-in">
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="current-password" className="text-xs font-medium">Senha Atual</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={senhaAtual}
                      onChange={(e) => setSenhaAtual(e.target.value)}
                      className="border-primary/20 focus-visible:ring-primary/30 h-9 text-sm"
                      placeholder="Digite sua senha atual"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="new-password" className="text-xs font-medium">Nova Senha</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={novaSenha}
                      onChange={(e) => setNovaSenha(e.target.value)}
                      className="border-primary/20 focus-visible:ring-primary/30 h-9 text-sm"
                      placeholder="Digite sua nova senha"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="confirm-password" className="text-xs font-medium">Confirmar Senha</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                      className="border-primary/20 focus-visible:ring-primary/30 h-9 text-sm"
                      placeholder="Confirme sua nova senha"
                    />
                  </div>
                  <Button 
                    onClick={handleChangePassword}
                    disabled={loading || !senhaAtual || !novaSenha || !confirmarSenha}
                    className="mt-3 bg-primary hover:bg-primary/90 transition-colors h-9 text-sm"
                    size="sm"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        <span>Alterando...</span>
                      </>
                    ) : (
                      <>
                        <Key className="mr-2 h-3 w-3" />
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
        <Card className="md:col-span-3 border-primary/10 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-primary/10 px-5 py-3 rounded-t-lg">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <History className="h-4 w-4 text-primary" />
                Histórico de Acessos
              </CardTitle>
              <CardDescription className="text-xs">Seus últimos acessos ao sistema</CardDescription>
            </div>
            <Button variant="outline" size="icon" disabled className="h-8 w-8 border-primary/20 hover:bg-primary/5">
              <RefreshCw className="h-3 w-3" />
              <span className="sr-only">Atualizar</span>
            </Button>
          </CardHeader>
          <CardContent className="p-5">
            <div className="rounded-md border border-primary/10 overflow-hidden shadow-sm">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-primary/5">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground tracking-wider uppercase">Data/Hora</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground tracking-wider uppercase">IP</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground tracking-wider uppercase">Navegador</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground tracking-wider uppercase">Local</th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {historico && historico.length > 0 ? (
                    historico.map((acesso) => (
                      <tr key={acesso.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap text-xs">
                          {new Date(acesso.dataHora).toLocaleString('pt-BR')}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-xs">{acesso.ip}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-xs truncate max-w-[200px]">
                          {acesso.browser}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-xs">{acesso.local}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-4 text-center text-xs text-muted-foreground">
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
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
} from "lucide-react";
import { toast } from "sonner";
import { getInitials } from "@/lib/utils";

interface HistoricoAcesso {
  id: string;
  dataHora: string;
  ip: string;
  browser: string;
  local: string;
}

export default function PerfilPage() {
  const { data: session, update } = useSession();
  
  const [nome, setNome] = useState(session?.user?.name || "");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const [loadingHistorico, setLoadingHistorico] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(session?.user?.image || null);
  const [historicoAcessos, setHistoricoAcessos] = useState<HistoricoAcesso[]>([]);

  // Buscar histórico de acessos
  const buscarHistoricoAcessos = async () => {
    if (!session?.user?.id) return;
    
    setLoadingHistorico(true);
    
    try {
      const response = await fetch(`/api/auth/acesso?userId=${session.user.id}`);
      const data = await response.json();
      
      if (data.historico) {
        setHistoricoAcessos(data.historico);
      }
    } catch (error) {
      console.error("Erro ao buscar histórico de acesso:", error);
      toast.error("Não foi possível carregar o histórico de acessos");
    } finally {
      setLoadingHistorico(false);
    }
  };

  // Carregar histórico quando a página for montada
  useEffect(() => {
    if (session?.user?.id) {
      buscarHistoricoAcessos();
    }
  }, [session?.user?.id]);

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

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(data);
  };

  if (!session?.user) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">Meu Perfil</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Coluna da esquerda - Foto */}
        <Card className="border-primary/10">
          <CardHeader className="bg-primary/10 p-4 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Foto de Perfil
            </CardTitle>
            <CardDescription>Altere sua foto de perfil</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4 pt-6">
            <Avatar className="h-32 w-32 border-4 border-primary/10 shadow-lg">
              <AvatarImage src={photoPreview || undefined} alt={session.user.name || ""} />
              <AvatarFallback className="text-2xl bg-primary/5">{getInitials(session.user.name)}</AvatarFallback>
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
          <CardHeader className="bg-primary/10 p-4 rounded-t-lg">
            <CardTitle>Dados pessoais</CardTitle>
            <CardDescription>Altere seus dados ou senha de acesso</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
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
              
              <TabsContent value="dados" className="space-y-4 pt-2 data-[state=active]:animate-in data-[state=active]:fade-in-50">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Seu nome completo"
                    className="border-primary/20 focus-visible:ring-primary/30"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    value={session.user.email || ""}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">O e-mail não pode ser alterado.</p>
                </div>
                
                <Button 
                  onClick={handleSaveProfile} 
                  disabled={loading || nome === session.user.name}
                  className="mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      <span>Salvar alterações</span>
                    </>
                  )}
                </Button>
              </TabsContent>
              
              <TabsContent value="senha" className="space-y-4 pt-2 data-[state=active]:animate-in data-[state=active]:fade-in-50">
                <div className="space-y-2">
                  <Label htmlFor="senha-atual">Senha atual</Label>
                  <Input
                    id="senha-atual"
                    type="password"
                    value={senhaAtual}
                    onChange={(e) => setSenhaAtual(e.target.value)}
                    placeholder="Digite sua senha atual"
                    className="border-primary/20 focus-visible:ring-primary/30"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="nova-senha">Nova senha</Label>
                  <Input
                    id="nova-senha"
                    type="password"
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    placeholder="Digite sua nova senha"
                    className="border-primary/20 focus-visible:ring-primary/30"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmar-senha">Confirmar nova senha</Label>
                  <Input
                    id="confirmar-senha"
                    type="password"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    placeholder="Confirme sua nova senha"
                    className="border-primary/20 focus-visible:ring-primary/30"
                  />
                </div>
                
                <Button 
                  onClick={handleChangePassword} 
                  disabled={loading || !senhaAtual || !novaSenha || !confirmarSenha}
                  className="mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span>Alterando...</span>
                    </>
                  ) : (
                    <>
                      <Key className="mr-2 h-4 w-4" />
                      <span>Alterar senha</span>
                    </>
                  )}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        {/* Terceira coluna - Histórico de acessos (ocupa toda a largura em telas maiores) */}
        <Card className="md:col-span-3 border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-primary/10 p-4 rounded-t-lg">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Histórico de acessos
              </CardTitle>
              <CardDescription>Seus últimos acessos ao sistema (horário em UTC)</CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={buscarHistoricoAcessos}
              disabled={loadingHistorico}
              className="h-9 w-9 border-primary/20 hover:bg-primary/5"
            >
              <RefreshCw className={`h-4 w-4 ${loadingHistorico ? 'animate-spin' : ''}`} />
              <span className="sr-only">Atualizar</span>
            </Button>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="rounded-md border border-primary/10 overflow-hidden">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr className="bg-primary/5">
                    <th className="px-4 py-3 text-left text-sm font-medium">Data/Hora</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Local</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Endereço IP</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Navegador</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loadingHistorico ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center">
                        <Loader2 className="h-5 w-5 animate-spin mx-auto text-primary/70" />
                        <span className="text-sm text-muted-foreground mt-2 block">
                          Carregando histórico...
                        </span>
                      </td>
                    </tr>
                  ) : historicoAcessos.length > 0 ? (
                    historicoAcessos.map((acesso) => (
                      <tr key={acesso.id} className="hover:bg-muted/50">
                        <td className="px-4 py-3 text-sm">{formatarData(acesso.dataHora)}</td>
                        <td className="px-4 py-3 text-sm">{acesso.local}</td>
                        <td className="px-4 py-3 text-sm">{acesso.ip}</td>
                        <td className="px-4 py-3 text-sm">{acesso.browser}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                        Nenhum registro de acesso encontrado.
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
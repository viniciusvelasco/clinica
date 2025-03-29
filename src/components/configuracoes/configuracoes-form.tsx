"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Monitor,
  Moon,
  Sun,
  Globe2,
  Shield,
  Loader2,
  ShieldCheck,
  ShieldAlert,
  Palette,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import { useLanguage } from "@/contexts/language-context";
import 'flag-icons/css/flag-icons.min.css';

interface ConfiguracoesFormProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    mfaEnabled?: boolean;
    mfaSecret?: string | null;
  };
}

export function ConfiguracoesForm({ user }: ConfiguracoesFormProps) {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(user.mfaEnabled || false);
  const [mfaCode, setMfaCode] = useState("");
  
  // Evitar erro de hidratação
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // URL para o QR Code do MFA (normalmente viria do backend)
  const mfaQrCodeUrl = user.mfaSecret 
    ? `otpauth://totp/Clinica:${user.email}?secret=${user.mfaSecret}&issuer=Clinica`
    : "";

  const handleMfaToggle = async () => {
    setLoading(true);
    
    try {
      if (!mfaEnabled && !user.mfaSecret) {
        // Aqui seria feita a requisição para gerar o segredo MFA
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        toast.success("MFA ativado", {
          description: "Configure o aplicativo autenticador usando o QR Code."
        });
      } else if (!mfaEnabled && mfaCode) {
        // Aqui seria feita a validação do código MFA
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        toast.success("MFA verificado", {
          description: "Autenticação de dois fatores ativada com sucesso."
        });
      } else {
        // Aqui seria feita a desativação do MFA
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        toast.success("MFA desativado", {
          description: "Autenticação de dois fatores desativada com sucesso."
        });
      }
      
      setMfaEnabled(!mfaEnabled);
    } catch (error) {
      toast.error("Erro ao configurar MFA", {
        description: "Ocorreu um erro ao configurar a autenticação de dois fatores."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = async (value: string) => {
    setLoading(true);
    
    try {
      // Aqui seria feita a atualização do idioma no servidor
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLanguage(value as any);
      
      toast.success("Idioma alterado", {
        description: "O idioma foi alterado com sucesso."
      });
    } catch (error) {
      toast.error("Erro ao alterar idioma", {
        description: "Ocorreu um erro ao alterar o idioma."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6 text-foreground">Configurações</h1>
      
      <Card className="border-primary/10 shadow-sm">
        <CardHeader className="bg-primary/10 px-5 py-3 rounded-t-lg">
          <CardTitle className="text-base">Preferências do Sistema</CardTitle>
          <CardDescription className="text-xs">Personalize as configurações do sistema</CardDescription>
        </CardHeader>
        <CardContent className="p-5">
          <Tabs defaultValue="tema" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted rounded-lg p-1 h-10">
              <TabsTrigger 
                value="tema" 
                className="rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=active]:font-medium flex items-center justify-center py-2 gap-2 transition-all duration-200 text-sm"
              >
                <Palette className="h-4 w-4" />
                Tema
              </TabsTrigger>
              <TabsTrigger 
                value="idioma" 
                className="rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=active]:font-medium flex items-center justify-center py-2 gap-2 transition-all duration-200 text-sm"
              >
                <Globe2 className="h-4 w-4" />
                Idioma
              </TabsTrigger>
              <TabsTrigger 
                value="seguranca" 
                className="rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=active]:font-medium flex items-center justify-center py-2 gap-2 transition-all duration-200 text-sm"
              >
                <Shield className="h-4 w-4" />
                Segurança
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="tema" className="space-y-4 animate-in fade-in-50">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <Card 
                    className={`relative cursor-pointer transition-all duration-200 hover:shadow-md ${theme === 'light' ? 'ring-2 ring-primary' : 'hover:ring-1 hover:ring-primary/20'}`}
                    onClick={() => setTheme('light')}
                  >
                    <CardContent className="p-4 flex flex-col items-center gap-2">
                      <Sun className="h-6 w-6 text-primary" />
                      <span className="text-sm font-medium">Claro</span>
                    </CardContent>
                  </Card>
                  
                  <Card 
                    className={`relative cursor-pointer transition-all duration-200 hover:shadow-md ${theme === 'dark' ? 'ring-2 ring-primary' : 'hover:ring-1 hover:ring-primary/20'}`}
                    onClick={() => setTheme('dark')}
                  >
                    <CardContent className="p-4 flex flex-col items-center gap-2">
                      <Moon className="h-6 w-6 text-primary" />
                      <span className="text-sm font-medium">Escuro</span>
                    </CardContent>
                  </Card>
                  
                  <Card 
                    className={`relative cursor-pointer transition-all duration-200 hover:shadow-md ${theme === 'system' ? 'ring-2 ring-primary' : 'hover:ring-1 hover:ring-primary/20'}`}
                    onClick={() => setTheme('system')}
                  >
                    <CardContent className="p-4 flex flex-col items-center gap-2">
                      <Monitor className="h-6 w-6 text-primary" />
                      <span className="text-sm font-medium">Sistema</span>
                    </CardContent>
                  </Card>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  Escolha entre o tema claro, escuro ou siga as configurações do seu sistema.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="idioma" className="space-y-4 animate-in fade-in-50">
              <div className="space-y-4">
                <Label className="text-sm font-medium">Selecione o idioma</Label>
                
                <div className="flex flex-row justify-center gap-4">
                  <button
                    className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-all w-1/3
                      ${language === 'pt-BR' 
                        ? 'bg-primary/10 border-primary ring-2 ring-primary/50' 
                        : 'border-border hover:border-primary/20 hover:bg-muted/50'}`}
                    onClick={() => handleLanguageChange('pt-BR')}
                    disabled={loading}
                  >
                    <div className="relative h-20 w-32 overflow-hidden rounded-md shadow-sm mb-3">
                      <span className="fi fi-br absolute inset-0" />
                      {language === 'pt-BR' && (
                        <div className="absolute right-2 bottom-2 bg-primary rounded-full p-1">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <span className="font-medium">Português</span>
                      <span className="text-xs text-muted-foreground">Brasil</span>
                    </div>
                    {loading && language === 'pt-BR' && (
                      <Loader2 className="mt-2 h-4 w-4 animate-spin text-primary" />
                    )}
                  </button>
                  
                  <button
                    className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-all w-1/3
                      ${language === 'en-US' 
                        ? 'bg-primary/10 border-primary ring-2 ring-primary/50' 
                        : 'border-border hover:border-primary/20 hover:bg-muted/50'}`}
                    onClick={() => handleLanguageChange('en-US')}
                    disabled={loading}
                  >
                    <div className="relative h-20 w-32 overflow-hidden rounded-md shadow-sm mb-3">
                      <span className="fi fi-us absolute inset-0" />
                      {language === 'en-US' && (
                        <div className="absolute right-2 bottom-2 bg-primary rounded-full p-1">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <span className="font-medium">English</span>
                      <span className="text-xs text-muted-foreground">United States</span>
                    </div>
                    {loading && language === 'en-US' && (
                      <Loader2 className="mt-2 h-4 w-4 animate-spin text-primary" />
                    )}
                  </button>
                  
                  <button
                    className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-all w-1/3
                      ${language === 'es-ES' 
                        ? 'bg-primary/10 border-primary ring-2 ring-primary/50' 
                        : 'border-border hover:border-primary/20 hover:bg-muted/50'}`}
                    onClick={() => handleLanguageChange('es-ES')}
                    disabled={loading}
                  >
                    <div className="relative h-20 w-32 overflow-hidden rounded-md shadow-sm mb-3">
                      <span className="fi fi-es absolute inset-0" />
                      {language === 'es-ES' && (
                        <div className="absolute right-2 bottom-2 bg-primary rounded-full p-1">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <span className="font-medium">Español</span>
                      <span className="text-xs text-muted-foreground">España</span>
                    </div>
                    {loading && language === 'es-ES' && (
                      <Loader2 className="mt-2 h-4 w-4 animate-spin text-primary" />
                    )}
                  </button>
                </div>
                
                <p className="text-xs text-muted-foreground text-center">
                  O idioma selecionado será aplicado em toda a interface do sistema.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="seguranca" className="space-y-4 animate-in fade-in-50">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Autenticação de dois fatores (2FA)</Label>
                    <p className="text-xs text-muted-foreground">
                      Adicione uma camada extra de segurança à sua conta.
                    </p>
                  </div>
                  <Switch
                    checked={mfaEnabled}
                    onCheckedChange={handleMfaToggle}
                    disabled={loading}
                  />
                </div>
                
                {mfaEnabled && !user.mfaSecret && (
                  <div className="space-y-4 border rounded-lg p-4 bg-muted/10">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Configure o autenticador</Label>
                      <p className="text-xs text-muted-foreground">
                        Escaneie o QR Code abaixo com seu aplicativo autenticador (Google Authenticator, Authy, etc).
                      </p>
                    </div>
                    
                    <div className="flex justify-center p-4 bg-white rounded-lg">
                      <QRCodeSVG value={mfaQrCodeUrl} size={200} />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="mfa-code" className="text-xs font-medium">
                        Digite o código gerado no aplicativo
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="mfa-code"
                          value={mfaCode}
                          onChange={(e) => setMfaCode(e.target.value)}
                          placeholder="000000"
                          className="h-9 text-sm"
                          maxLength={6}
                        />
                        <Button 
                          onClick={handleMfaToggle}
                          disabled={loading || !mfaCode || mfaCode.length !== 6}
                          className="h-9 text-sm"
                          size="sm"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                              <span>Verificando...</span>
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="mr-2 h-3 w-3" />
                              <span>Verificar</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                {mfaEnabled && user.mfaSecret && (
                  <div className="flex items-center gap-2 text-sm text-green-500">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Autenticação de dois fatores está ativa</span>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 
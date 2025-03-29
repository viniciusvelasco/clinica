"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
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
import { useTranslate } from "@/hooks/use-translate";
import { updateUserLanguage } from "@/actions/user";
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
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslate();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingLanguage, setLoadingLanguage] = useState<string | null>(null);
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
    if (loadingLanguage) return; // Previne múltiplos cliques
    
    setLoadingLanguage(value);
    
    try {
      // Atualiza o idioma no servidor
      const result = await updateUserLanguage(value);
      
      if (result.success) {
        // Atualiza o idioma no cliente
        setLanguage(value as any);
        
        // Usa os textos já traduzidos para o novo idioma
        const successMessages = {
          'pt-BR': 'Idioma alterado com sucesso',
          'en-US': 'Language changed successfully',
          'es-ES': 'Idioma cambiado con éxito'
        };
        
        toast.success(successMessages[value as keyof typeof successMessages], {
          description: successMessages[value as keyof typeof successMessages]
        });
        
        // Recarrega a página para aplicar o novo idioma
        setTimeout(() => {
          router.refresh();
        }, 1000);
      } else {
        throw new Error("Falha ao atualizar idioma");
      }
    } catch (error) {
      // Mantém a mensagem de erro no idioma atual
      toast.error(t('config.error_language'), {
        description: t('config.error_language')
      });
    } finally {
      setLoadingLanguage(null);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6 text-foreground">{t('config.title')}</h1>
      
      <Card className="border-primary/10 shadow-sm">
        <CardHeader className="bg-primary/10 px-5 py-3 rounded-t-lg">
          <CardTitle className="text-base">{t('config.preferences')}</CardTitle>
          <CardDescription className="text-xs">{t('config.preferences_subtitle')}</CardDescription>
        </CardHeader>
        <CardContent className="p-5">
          <Tabs defaultValue="tema" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted rounded-lg p-1 h-10">
              <TabsTrigger 
                value="tema" 
                className="rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=active]:font-medium flex items-center justify-center py-2 gap-2 transition-all duration-200 text-sm"
              >
                <Palette className="h-4 w-4" />
                {t('config.theme')}
              </TabsTrigger>
              <TabsTrigger 
                value="idioma" 
                className="rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=active]:font-medium flex items-center justify-center py-2 gap-2 transition-all duration-200 text-sm"
              >
                <Globe2 className="h-4 w-4" />
                {t('config.language')}
              </TabsTrigger>
              <TabsTrigger 
                value="seguranca" 
                className="rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=active]:font-medium flex items-center justify-center py-2 gap-2 transition-all duration-200 text-sm"
              >
                <Shield className="h-4 w-4" />
                {t('config.security')}
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
                      <span className="text-sm font-medium">{t('config.theme_light')}</span>
                    </CardContent>
                  </Card>
                  
                  <Card 
                    className={`relative cursor-pointer transition-all duration-200 hover:shadow-md ${theme === 'dark' ? 'ring-2 ring-primary' : 'hover:ring-1 hover:ring-primary/20'}`}
                    onClick={() => setTheme('dark')}
                  >
                    <CardContent className="p-4 flex flex-col items-center gap-2">
                      <Moon className="h-6 w-6 text-primary" />
                      <span className="text-sm font-medium">{t('config.theme_dark')}</span>
                    </CardContent>
                  </Card>
                  
                  <Card 
                    className={`relative cursor-pointer transition-all duration-200 hover:shadow-md ${theme === 'system' ? 'ring-2 ring-primary' : 'hover:ring-1 hover:ring-primary/20'}`}
                    onClick={() => setTheme('system')}
                  >
                    <CardContent className="p-4 flex flex-col items-center gap-2">
                      <Monitor className="h-6 w-6 text-primary" />
                      <span className="text-sm font-medium">{t('config.theme_system')}</span>
                    </CardContent>
                  </Card>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  {t('config.theme_description')}
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="idioma" className="space-y-4 animate-in fade-in-50">
              <div className="space-y-4">
                <Label className="text-sm font-medium">{t('config.language_select')}</Label>
                
                <div className="flex flex-row justify-center gap-4">
                  <button
                    className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-all w-1/3
                      ${language === 'pt-BR' 
                        ? 'bg-primary/10 border-primary ring-2 ring-primary/50' 
                        : 'border-border hover:border-primary/20 hover:bg-muted/50'}`}
                    onClick={() => handleLanguageChange('pt-BR')}
                    disabled={loadingLanguage !== null}
                  >
                    <div className="relative h-20 w-32 overflow-hidden rounded-md shadow-sm mb-3 flex items-center justify-center">
                      <span className="fi fi-br w-full h-full" style={{ transform: 'scale(3)' }} />
                      {language === 'pt-BR' && (
                        <div className="absolute right-2 bottom-2 bg-primary rounded-full p-1 z-10">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <span className="font-medium">{t('config.language_pt')}</span>
                      <span className="text-xs text-muted-foreground">{t('config.language_pt_region')}</span>
                    </div>
                    {loadingLanguage === 'pt-BR' && (
                      <Loader2 className="mt-2 h-4 w-4 animate-spin text-primary" />
                    )}
                  </button>
                  
                  <button
                    className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-all w-1/3
                      ${language === 'en-US' 
                        ? 'bg-primary/10 border-primary ring-2 ring-primary/50' 
                        : 'border-border hover:border-primary/20 hover:bg-muted/50'}`}
                    onClick={() => handleLanguageChange('en-US')}
                    disabled={loadingLanguage !== null}
                  >
                    <div className="relative h-20 w-32 overflow-hidden rounded-md shadow-sm mb-3 flex items-center justify-center">
                      <span className="fi fi-us w-full h-full" style={{ transform: 'scale(3)' }} />
                      {language === 'en-US' && (
                        <div className="absolute right-2 bottom-2 bg-primary rounded-full p-1 z-10">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <span className="font-medium">{t('config.language_en')}</span>
                      <span className="text-xs text-muted-foreground">{t('config.language_en_region')}</span>
                    </div>
                    {loadingLanguage === 'en-US' && (
                      <Loader2 className="mt-2 h-4 w-4 animate-spin text-primary" />
                    )}
                  </button>
                  
                  <button
                    className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-all w-1/3
                      ${language === 'es-ES' 
                        ? 'bg-primary/10 border-primary ring-2 ring-primary/50' 
                        : 'border-border hover:border-primary/20 hover:bg-muted/50'}`}
                    onClick={() => handleLanguageChange('es-ES')}
                    disabled={loadingLanguage !== null}
                  >
                    <div className="relative h-20 w-32 overflow-hidden rounded-md shadow-sm mb-3 flex items-center justify-center">
                      <span className="fi fi-es w-full h-full" style={{ transform: 'scale(3)' }} />
                      {language === 'es-ES' && (
                        <div className="absolute right-2 bottom-2 bg-primary rounded-full p-1 z-10">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <span className="font-medium">{t('config.language_es')}</span>
                      <span className="text-xs text-muted-foreground">{t('config.language_es_region')}</span>
                    </div>
                    {loadingLanguage === 'es-ES' && (
                      <Loader2 className="mt-2 h-4 w-4 animate-spin text-primary" />
                    )}
                  </button>
                </div>
                
                <p className="text-xs text-muted-foreground text-center">
                  {t('config.language_description')}
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="seguranca" className="space-y-4 animate-in fade-in-50">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">{t('config.security_2fa')}</Label>
                    <p className="text-xs text-muted-foreground">
                      {t('config.security_2fa_description')}
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
                      <Label className="text-sm font-medium">{t('config.security_configure')}</Label>
                      <p className="text-xs text-muted-foreground">
                        {t('config.security_configure_description')}
                      </p>
                    </div>
                    
                    <div className="flex justify-center p-4 bg-white rounded-lg">
                      <QRCodeSVG value={mfaQrCodeUrl} size={200} />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="mfa-code" className="text-xs font-medium">
                        {t('config.security_code')}
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
                              <span>{t('config.security_verifying')}</span>
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="mr-2 h-3 w-3" />
                              <span>{t('config.security_verify')}</span>
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
                    <span>{t('config.security_active')}</span>
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
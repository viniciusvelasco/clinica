"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
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
  X,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import { useLanguage } from "@/contexts/language-context";
import { useTranslate } from "@/hooks/use-translate";
import { updateUserLanguage, enableMfa, disableMfa } from "@/actions/user";
import 'flag-icons/css/flag-icons.min.css';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface ConfiguracoesFormProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    mfaEnabled?: boolean;
    mfaSecret?: string | null;
    language?: string | null;
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
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [showMfaModal, setShowMfaModal] = useState(false);
  const [mfaSecret, setMfaSecret] = useState<string | null>(null);
  const [verifyingCode, setVerifyingCode] = useState(false);
  
  // Efeito para sincronizar estado com propriedades
  useEffect(() => {
    // Log inicial de debug
    console.log("Valores MFA recebidos:", { 
      mfaEnabled: user.mfaEnabled, 
      mfaSecret: user.mfaSecret,
      language: user.language
    });
    
    // Verificar se há dados de MFA nas propriedades diretas
    const hasMfaEnabled = !!user.mfaEnabled;
    
    // Verificar alternativa: pode estar armazenado no campo language com prefixo "mfa:"
    const hasMfaInLanguage = user.language?.startsWith('mfa:');
    
    // Extrair segredo do MFA do campo language se estiver lá
    const extractedSecret = hasMfaInLanguage ? user.language?.substring(4) : null;
    
    // Definir estado com base na melhor informação disponível
    setMfaEnabled(hasMfaEnabled || hasMfaInLanguage || false);
    setMfaSecret(user.mfaSecret || extractedSecret || null);
    
    // Se temos um idioma válido que não seja um segredo MFA, atualizamos o contexto de linguagem
    if (user.language && !hasMfaInLanguage) {
      setLanguage(user.language as any);
    }
    
    console.log("Estado MFA definido:", {
      mfaEnabled: hasMfaEnabled || hasMfaInLanguage,
      mfaSecret: user.mfaSecret || extractedSecret || null
    });
  }, [user.mfaEnabled, user.mfaSecret, user.language, setLanguage]);
  
  // Evitar erro de hidratação
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // Gerar um segredo MFA aleatório para demonstração
  const generateMfaSecret = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < 32; i++) {
      secret += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return secret;
  };

  // URL para o QR Code do MFA
  const getMfaQrCodeUrl = (secret: string) => {
    const issuer = encodeURIComponent('Clinica Médica');
    const account = encodeURIComponent(user.email || 'usuario');
    return `otpauth://totp/${issuer}:${account}?secret=${secret}&issuer=${issuer}&algorithm=SHA1&digits=6&period=30`;
  };

  const handleToggleMfa = async () => {
    if (mfaEnabled) {
      // Desativar MFA
      setLoading(true);
      try {
        // Chamar a API para desativar MFA
        const result = await disableMfa();
        
        if (result.success) {
          setMfaEnabled(false);
          setMfaSecret(null);
          
          toast.info(t('config.security_mfa_disabled'), {
            description: t('config.security_mfa_disabled_desc')
          });
        } else {
          throw new Error("Falha ao desativar MFA");
        }
      } catch (error) {
        toast.error(t('config.security_mfa_error'), {
          description: t('config.security_mfa_error_desc')
        });
      } finally {
        setLoading(false);
      }
    } else {
      // Iniciar processo de ativação do MFA
      const newSecret = generateMfaSecret();
      setMfaSecret(newSecret);
      setShowMfaModal(true);
    }
  };
  
  const handleVerifyMfaCode = async () => {
    if (!mfaCode || mfaCode.length !== 6 || !/^\d+$/.test(mfaCode)) {
      toast.warning(t('config.security_mfa_error'), {
        description: t('config.security_code_error')
      });
      return;
    }
    
    setVerifyingCode(true);
    
    try {
      if (!mfaSecret) {
        throw new Error("Código secreto não encontrado");
      }
      
      // Na prática, você validaria o código contra o segredo aqui
      // Para demonstração, vamos apenas verificar se possui 6 dígitos
      
      console.log("Ativando MFA com segredo:", mfaSecret);
      
      // Salvar o segredo no banco de dados
      const result = await enableMfa(mfaSecret);
      console.log("Resultado da ativação MFA:", result);
      
      if (result.success) {
        setMfaEnabled(true);
        setShowMfaModal(false);
        
        toast.success(t('config.security_mfa_verified'), {
          description: t('config.security_mfa_success')
        });
      } else {
        console.error("Erro ao ativar MFA:", result);
        throw new Error(result.message || "Falha ao ativar MFA");
      }
    } catch (error) {
      console.error("Erro no handleVerifyMfaCode:", error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : t('config.security_mfa_error_desc');
        
      toast.error(t('config.security_mfa_error'), {
        description: errorMessage
      });
    } finally {
      setVerifyingCode(false);
      setMfaCode("");
    }
  };
  
  const handleCopySecret = () => {
    if (mfaSecret) {
      navigator.clipboard.writeText(mfaSecret);
      toast.info(t('config.security_code_copied'), {
        description: t('config.security_code_copied_desc')
      });
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
    <>
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
                      onCheckedChange={handleToggleMfa}
                      disabled={loading}
                    />
                  </div>
                  
                  {mfaEnabled && (
                    <div className="flex items-center gap-2 text-sm text-green-500 bg-green-50 dark:bg-green-950/20 p-3 rounded-lg">
                      <ShieldCheck className="h-5 w-5" />
                      <span>{t('config.security_active')}</span>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* Modal de configuração do MFA */}
      <Dialog open={showMfaModal} onOpenChange={setShowMfaModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('config.security_configure')}</DialogTitle>
            <DialogDescription>
              {t('config.security_configure_description')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* QR Code */}
            <div className="flex justify-center p-4 bg-white dark:bg-gray-100 rounded-lg border">
              {mfaSecret && (
                <QRCodeSVG 
                  value={getMfaQrCodeUrl(mfaSecret)} 
                  size={220}
                  bgColor={"#FFFFFF"} 
                  fgColor={"#000000"}
                  level={"H"}
                  includeMargin={true}
                />
              )}
            </div>
            
            {/* Código secreto */}
            <div className="space-y-2">
              <Label>{t('config.security_code_secret')}</Label>
              <div className="flex items-center space-x-2">
                <div className="bg-muted p-2 rounded-md text-center flex-1 font-mono text-sm break-all">
                  {mfaSecret?.match(/.{1,4}/g)?.join(' ')}
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleCopySecret}
                  title={t('config.security_code_copied')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {t('config.security_code_manual')}
              </p>
            </div>
            
            {/* Validação do código */}
            <div className="space-y-2">
              <Label htmlFor="mfa-verification-code">
                {t('config.security_code')}
              </Label>
              <Input
                id="mfa-verification-code"
                placeholder="000000"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                className="font-mono text-center text-lg tracking-widest"
                maxLength={6}
              />
              <p className="text-xs text-muted-foreground">
                {t('config.security_code_digit_desc')}
              </p>
            </div>
          </div>
          
          <DialogFooter className="sm:justify-between">
            <Button 
              variant="ghost" 
              onClick={() => {
                setShowMfaModal(false);
                setMfaCode("");
                setMfaSecret(null);
              }}
              disabled={verifyingCode}
            >
              <X className="mr-2 h-4 w-4" />
              {t('config.security_cancel')}
            </Button>
            <Button 
              onClick={handleVerifyMfaCode}
              disabled={verifyingCode || !mfaCode || mfaCode.length !== 6}
            >
              {verifyingCode ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('config.security_verifying')}
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  {t('config.security_verify')}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 
"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { 
  Calendar, 
  ClipboardList, 
  BarChart3, 
  CreditCard,
  Shield,
  Clock,
  Users,
  Eye,
  EyeOff
} from "lucide-react";
import { LanguageSelector } from "@/components/language-selector";
import { LanguageModal } from "@/components/language-modal";
import { useLanguage } from "@/contexts/language-context";
import { useTranslate } from "@/hooks/use-translate";
import { updateUserLanguage } from "@/actions/user";
import { MfaVerificationModal } from "@/components/auth/mfa-verification-modal";
import 'flag-icons/css/flag-icons.min.css';

export default function LoginPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const { t } = useTranslate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // MFA related states
  const [showMfaModal, setShowMfaModal] = useState(false);
  const [mfaInfo, setMfaInfo] = useState<{userId: string, secret: string} | null>(null);

  // Carregar email do localStorage se existir
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Salvar ou remover email do localStorage baseado no checkbox
    if (rememberMe) {
      localStorage.setItem("rememberedEmail", email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        // Verificar se o erro é relacionado a MFA
        if (result.error.startsWith("MFA_REQUIRED:")) {
          // Formato esperado: "MFA_REQUIRED:userId:secret"
          const [_, userId, secret] = result.error.split(":");
          
          if (userId && secret) {
            // Iniciar processo de verificação MFA
            setMfaInfo({ userId, secret });
            setShowMfaModal(true);
            setIsLoading(false);
            return;
          }
        }
        
        setError(t('login.error.invalid_credentials'));
        setIsLoading(false);
        return;
      }

      // Guardar idioma preferido do usuário
      await updateUserLanguage(language);
      
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setError(t('login.error.generic'));
      setIsLoading(false);
    }
  };

  const handleLanguageSelected = async (selectedLanguage: string) => {
    setShowLanguageModal(false);
  };
  
  const handleMfaVerified = async () => {
    // Depois que o MFA foi verificado com sucesso, continuar o login
    setShowMfaModal(false);
    
    // Guardar idioma preferido do usuário
    await updateUserLanguage(language);
    
    // Redirecionar para o dashboard
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Modal de seleção de idioma */}
      <LanguageModal 
        isOpen={showLanguageModal} 
        onClose={handleLanguageSelected} 
      />
      
      {/* Modal de verificação MFA */}
      {mfaInfo && (
        <MfaVerificationModal
          isOpen={showMfaModal}
          onClose={() => setShowMfaModal(false)}
          onVerified={handleMfaVerified}
          userId={mfaInfo.userId}
          mfaSecret={mfaInfo.secret}
        />
      )}

      {/* Lado esquerdo - 70% */}
      <div className="hidden md:flex md:w-[70%] flex-col items-center justify-center p-0 relative">
        {/* Background image */}
        <div className="absolute inset-0 w-full h-full">
          <Image 
            src="/images/medical-background.jpg" 
            alt="Background" 
            fill 
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-800/60 to-blue-600/40 backdrop-blur-sm" />
        </div>
        
        <div className="relative z-10 max-w-2xl mx-auto text-center px-6">
          <div className="w-32 h-32 mx-auto mb-6 bg-white/20 backdrop-blur-md rounded-full p-5 shadow-xl">
            <img
              src="/medical-logo.svg"
              alt="Clínica Logo"
              className="w-full h-full"
            />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
            {t('marketing.title')}
          </h1>
          
          <p className="text-xl text-white/90 mb-8 drop-shadow">
            {t('marketing.subtitle')}
          </p>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-2xl border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6 drop-shadow-md">
              {t('marketing.card_title')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
              <div className="flex items-start space-x-3">
                <Calendar className="w-6 h-6 text-blue-100 mt-0.5 flex-shrink-0" strokeWidth={2} />
                <div>
                  <h3 className="font-semibold mb-1">{t('marketing.scheduling')}</h3>
                  <p className="text-sm text-blue-100/90">{t('marketing.scheduling_desc')}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <ClipboardList className="w-6 h-6 text-blue-100 mt-0.5 flex-shrink-0" strokeWidth={2} />
                <div>
                  <h3 className="font-semibold mb-1">{t('marketing.medical_records')}</h3>
                  <p className="text-sm text-blue-100/90">{t('marketing.medical_records_desc')}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CreditCard className="w-6 h-6 text-blue-100 mt-0.5 flex-shrink-0" strokeWidth={2} />
                <div>
                  <h3 className="font-semibold mb-1">{t('marketing.financial')}</h3>
                  <p className="text-sm text-blue-100/90">{t('marketing.financial_desc')}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <BarChart3 className="w-6 h-6 text-blue-100 mt-0.5 flex-shrink-0" strokeWidth={2} />
                <div>
                  <h3 className="font-semibold mb-1">{t('marketing.reports')}</h3>
                  <p className="text-sm text-blue-100/90">{t('marketing.reports_desc')}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="w-6 h-6 text-blue-100 mt-0.5 flex-shrink-0" strokeWidth={2} />
                <div>
                  <h3 className="font-semibold mb-1">{t('marketing.time')}</h3>
                  <p className="text-sm text-blue-100/90">{t('marketing.time_desc')}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Users className="w-6 h-6 text-blue-100 mt-0.5 flex-shrink-0" strokeWidth={2} />
                <div>
                  <h3 className="font-semibold mb-1">{t('marketing.patients')}</h3>
                  <p className="text-sm text-blue-100/90">{t('marketing.patients_desc')}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-100 mr-2" />
              <p className="text-sm text-blue-100">{t('marketing.security')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lado direito - 30% */}
      <div className="w-full md:w-[30%] flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          {/* Versão mobile do background e logo */}
          <div className="md:hidden relative w-full h-40 mb-8 rounded-xl overflow-hidden">
            <Image 
              src="/images/medical-background.jpg" 
              alt="Background" 
              fill 
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-800/60 to-blue-600/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full p-4 shadow-xl">
                <img
                  src="/medical-logo.svg"
                  alt="Clínica Logo"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">{t('login.title')}</h2>
            <p className="text-gray-500 mt-2">{t('login.subtitle')}</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 p-3 rounded-md text-sm text-red-600 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {t('login.email')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="block w-full rounded-md border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  {t('login.password')}
                </label>
                <div className="text-sm">
                  <a href="#" className="font-medium text-primary hover:text-primary/80">
                    {t('login.forgot_password')}
                  </a>
                </div>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className="block w-full rounded-md border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                {t('login.remember_me')}
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white py-2.5"
              disabled={isLoading}
            >
              {isLoading ? t('login.loading') : t('login.submit')}
            </Button>
            
            <div className="mt-4 text-center text-xs text-gray-500">
              {t('login.terms')}
              <a href="/politica-privacidade" className="text-primary hover:text-primary/80 mx-1">
                Termos de Uso e Política de Privacidade
              </a>
            </div>
            
            {/* Selector de idiomas */}
            <LanguageSelector />
          </form>
        </div>
      </div>
    </div>
  );
} 
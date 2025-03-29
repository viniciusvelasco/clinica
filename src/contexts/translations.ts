type TranslationKey = 
  | 'login.title'
  | 'login.subtitle'
  | 'login.email'
  | 'login.password'
  | 'login.forgot_password'
  | 'login.remember_me'
  | 'login.submit'
  | 'login.loading'
  | 'login.terms'
  | 'login.error.invalid_credentials'
  | 'login.error.generic'
  | 'marketing.title'
  | 'marketing.subtitle'
  | 'marketing.card_title'
  | 'marketing.scheduling'
  | 'marketing.scheduling_desc'
  | 'marketing.medical_records'
  | 'marketing.medical_records_desc'
  | 'marketing.financial'
  | 'marketing.financial_desc'
  | 'marketing.reports'
  | 'marketing.reports_desc'
  | 'marketing.time'
  | 'marketing.time_desc'
  | 'marketing.patients'
  | 'marketing.patients_desc'
  | 'marketing.security'
  | 'language_modal.title'
  | 'language_modal.subtitle'
  | 'language_modal.confirm'
  | 'config.title'
  | 'config.preferences'
  | 'config.preferences_subtitle'
  | 'config.theme'
  | 'config.theme_light'
  | 'config.theme_dark'
  | 'config.theme_system'
  | 'config.theme_description'
  | 'config.language'
  | 'config.language_select'
  | 'config.language_description'
  | 'config.language_pt'
  | 'config.language_pt_region'
  | 'config.language_en'
  | 'config.language_en_region'
  | 'config.language_es'
  | 'config.language_es_region'
  | 'config.security'
  | 'config.security_2fa'
  | 'config.security_2fa_description'
  | 'config.security_configure'
  | 'config.security_configure_description'
  | 'config.security_code'
  | 'config.security_verify'
  | 'config.security_verifying'
  | 'config.security_active'
  | 'config.success_language'
  | 'config.error_language'
  | 'config.security_mfa_enabled'
  | 'config.security_mfa_setup_desc'
  | 'config.security_mfa_verified'
  | 'config.security_mfa_success'
  | 'config.security_mfa_disabled'
  | 'config.security_mfa_disabled_desc'
  | 'config.security_mfa_error'
  | 'config.security_mfa_error_desc'
  | 'config.security_code_error'
  | 'config.security_code_secret'
  | 'config.security_code_copied'
  | 'config.security_code_copied_desc'
  | 'config.security_code_manual'
  | 'config.security_code_digit_desc'
  | 'config.security_cancel'
  | 'auth.mfa_verification'
  | 'auth.mfa_verification_description'
  | 'auth.mfa_code'
  | 'auth.mfa_code_description'
  | 'auth.mfa_error'
  | 'auth.mfa_code_invalid'
  | 'auth.mfa_success'
  | 'auth.mfa_verified'
  | 'auth.mfa_verification_failed'
  | 'auth.cancel'
  | 'auth.verifying'
  | 'auth.verify';

type Translations = {
  [key in TranslationKey]: {
    'pt-BR': string;
    'en-US': string;
    'es-ES': string;
  };
};

// Definição das traduções para cada chave
export const translations: Translations = {
  'login.title': {
    'pt-BR': 'Acesse sua conta',
    'en-US': 'Sign in to your account',
    'es-ES': 'Accede a tu cuenta',
  },
  'login.subtitle': {
    'pt-BR': 'Insira suas credenciais para continuar',
    'en-US': 'Enter your credentials to continue',
    'es-ES': 'Ingresa tus credenciales para continuar',
  },
  'login.email': {
    'pt-BR': 'Email',
    'en-US': 'Email',
    'es-ES': 'Correo electrónico',
  },
  'login.password': {
    'pt-BR': 'Senha',
    'en-US': 'Password',
    'es-ES': 'Contraseña',
  },
  'login.forgot_password': {
    'pt-BR': 'Esqueceu a senha?',
    'en-US': 'Forgot password?',
    'es-ES': '¿Olvidaste tu contraseña?',
  },
  'login.remember_me': {
    'pt-BR': 'Lembrar meu email',
    'en-US': 'Remember my email',
    'es-ES': 'Recordar mi correo',
  },
  'login.submit': {
    'pt-BR': 'Entrar',
    'en-US': 'Sign in',
    'es-ES': 'Ingresar',
  },
  'login.loading': {
    'pt-BR': 'Entrando...',
    'en-US': 'Signing in...',
    'es-ES': 'Ingresando...',
  },
  'login.terms': {
    'pt-BR': 'Ao acessar, você concorda com nossos Termos de Uso e Política de Privacidade',
    'en-US': 'By signing in, you agree to our Terms of Use and Privacy Policy',
    'es-ES': 'Al acceder, aceptas nuestros Términos de uso y Política de privacidad',
  },
  'login.error.invalid_credentials': {
    'pt-BR': 'Credenciais inválidas',
    'en-US': 'Invalid credentials',
    'es-ES': 'Credenciales inválidas',
  },
  'login.error.generic': {
    'pt-BR': 'Ocorreu um erro ao fazer login',
    'en-US': 'An error occurred while signing in',
    'es-ES': 'Ocurrió un error al iniciar sesión',
  },
  'marketing.title': {
    'pt-BR': 'Sistema de Gestão Clínica',
    'en-US': 'Clinical Management System',
    'es-ES': 'Sistema de Gestión Clínica',
  },
  'marketing.subtitle': {
    'pt-BR': 'Simplifique o atendimento e potencialize seus resultados',
    'en-US': 'Simplify care and enhance your results',
    'es-ES': 'Simplifique la atención y potencie sus resultados',
  },
  'marketing.card_title': {
    'pt-BR': 'Tudo o que você precisa em um só lugar',
    'en-US': 'Everything you need in one place',
    'es-ES': 'Todo lo que necesitas en un solo lugar',
  },
  'marketing.scheduling': {
    'pt-BR': 'Agendamento Inteligente',
    'en-US': 'Smart Scheduling',
    'es-ES': 'Programación Inteligente',
  },
  'marketing.scheduling_desc': {
    'pt-BR': 'Gerenciamento de consultas sem conflitos',
    'en-US': 'Conflict-free appointment management',
    'es-ES': 'Gestión de citas sin conflictos',
  },
  'marketing.medical_records': {
    'pt-BR': 'Prontuário Eletrônico',
    'en-US': 'Electronic Medical Records',
    'es-ES': 'Historial Médico Electrónico',
  },
  'marketing.medical_records_desc': {
    'pt-BR': 'Histórico completo e acessível',
    'en-US': 'Complete and accessible history',
    'es-ES': 'Historial completo y accesible',
  },
  'marketing.financial': {
    'pt-BR': 'Gestão Financeira',
    'en-US': 'Financial Management',
    'es-ES': 'Gestión Financiera',
  },
  'marketing.financial_desc': {
    'pt-BR': 'Controle completo de receitas e despesas',
    'en-US': 'Complete control of income and expenses',
    'es-ES': 'Control completo de ingresos y gastos',
  },
  'marketing.reports': {
    'pt-BR': 'Relatórios Detalhados',
    'en-US': 'Detailed Reports',
    'es-ES': 'Informes Detallados',
  },
  'marketing.reports_desc': {
    'pt-BR': 'Análises e insights para decisões',
    'en-US': 'Analysis and insights for decisions',
    'es-ES': 'Análisis e ideas para decisiones',
  },
  'marketing.time': {
    'pt-BR': 'Otimização de Tempo',
    'en-US': 'Time Optimization',
    'es-ES': 'Optimización del Tiempo',
  },
  'marketing.time_desc': {
    'pt-BR': 'Automação de tarefas rotineiras',
    'en-US': 'Automation of routine tasks',
    'es-ES': 'Automatización de tareas rutinarias',
  },
  'marketing.patients': {
    'pt-BR': 'Gestão de Pacientes',
    'en-US': 'Patient Management',
    'es-ES': 'Gestión de Pacientes',
  },
  'marketing.patients_desc': {
    'pt-BR': 'Acompanhamento completo e personalizado',
    'en-US': 'Complete and personalized monitoring',
    'es-ES': 'Seguimiento completo y personalizado',
  },
  'marketing.security': {
    'pt-BR': 'Dados protegidos com criptografia de ponta a ponta',
    'en-US': 'Data protected with end-to-end encryption',
    'es-ES': 'Datos protegidos con cifrado de extremo a extremo',
  },
  'language_modal.title': {
    'pt-BR': 'Selecione seu idioma',
    'en-US': 'Select your language',
    'es-ES': 'Selecciona tu idioma',
  },
  'language_modal.subtitle': {
    'pt-BR': 'Escolha o idioma que você deseja usar nesta aplicação',
    'en-US': 'Choose the language you want to use in this application',
    'es-ES': 'Elige el idioma que deseas usar en esta aplicación',
  },
  'language_modal.confirm': {
    'pt-BR': 'Confirmar',
    'en-US': 'Confirm',
    'es-ES': 'Confirmar',
  },
  'config.title': {
    'pt-BR': 'Configurações',
    'en-US': 'Settings',
    'es-ES': 'Configuración',
  },
  'config.preferences': {
    'pt-BR': 'Preferências do Sistema',
    'en-US': 'System Preferences',
    'es-ES': 'Preferencias del Sistema',
  },
  'config.preferences_subtitle': {
    'pt-BR': 'Personalize as configurações do sistema',
    'en-US': 'Customize system settings',
    'es-ES': 'Personaliza la configuración del sistema',
  },
  'config.theme': {
    'pt-BR': 'Tema',
    'en-US': 'Theme',
    'es-ES': 'Tema',
  },
  'config.theme_light': {
    'pt-BR': 'Claro',
    'en-US': 'Light',
    'es-ES': 'Claro',
  },
  'config.theme_dark': {
    'pt-BR': 'Escuro',
    'en-US': 'Dark',
    'es-ES': 'Oscuro',
  },
  'config.theme_system': {
    'pt-BR': 'Sistema',
    'en-US': 'System',
    'es-ES': 'Sistema',
  },
  'config.theme_description': {
    'pt-BR': 'Escolha entre o tema claro, escuro ou siga as configurações do seu sistema.',
    'en-US': 'Choose between light, dark theme or follow your system settings.',
    'es-ES': 'Elige entre el tema claro, oscuro o sigue la configuración de tu sistema.',
  },
  'config.language': {
    'pt-BR': 'Idioma',
    'en-US': 'Language',
    'es-ES': 'Idioma',
  },
  'config.language_select': {
    'pt-BR': 'Selecione o idioma',
    'en-US': 'Select language',
    'es-ES': 'Selecciona el idioma',
  },
  'config.language_description': {
    'pt-BR': 'O idioma selecionado será aplicado em toda a interface do sistema.',
    'en-US': 'The selected language will be applied throughout the system interface.',
    'es-ES': 'El idioma seleccionado se aplicará en toda la interfaz del sistema.',
  },
  'config.language_pt': {
    'pt-BR': 'Português',
    'en-US': 'Portuguese',
    'es-ES': 'Portugués',
  },
  'config.language_pt_region': {
    'pt-BR': 'Brasil',
    'en-US': 'Brazil',
    'es-ES': 'Brasil',
  },
  'config.language_en': {
    'pt-BR': 'Inglês',
    'en-US': 'English',
    'es-ES': 'Inglés',
  },
  'config.language_en_region': {
    'pt-BR': 'Estados Unidos',
    'en-US': 'United States',
    'es-ES': 'Estados Unidos',
  },
  'config.language_es': {
    'pt-BR': 'Espanhol',
    'en-US': 'Spanish',
    'es-ES': 'Español',
  },
  'config.language_es_region': {
    'pt-BR': 'Espanha',
    'en-US': 'Spain',
    'es-ES': 'España',
  },
  'config.security': {
    'pt-BR': 'Segurança',
    'en-US': 'Security',
    'es-ES': 'Seguridad',
  },
  'config.security_2fa': {
    'pt-BR': 'Autenticação de dois fatores (2FA)',
    'en-US': 'Two-factor authentication (2FA)',
    'es-ES': 'Autenticación de dos factores (2FA)',
  },
  'config.security_2fa_description': {
    'pt-BR': 'Adicione uma camada extra de segurança à sua conta.',
    'en-US': 'Add an extra layer of security to your account.',
    'es-ES': 'Añade una capa adicional de seguridad a tu cuenta.',
  },
  'config.security_configure': {
    'pt-BR': 'Configure o autenticador',
    'en-US': 'Configure authenticator',
    'es-ES': 'Configura el autenticador',
  },
  'config.security_configure_description': {
    'pt-BR': 'Escaneie o QR Code abaixo com seu aplicativo autenticador (Google Authenticator, Authy, etc).',
    'en-US': 'Scan the QR Code below with your authenticator app (Google Authenticator, Authy, etc).',
    'es-ES': 'Escanea el código QR con tu aplicación de autenticación (Google Authenticator, Authy, etc).',
  },
  'config.security_code': {
    'pt-BR': 'Digite o código gerado no aplicativo',
    'en-US': 'Enter the code generated in the app',
    'es-ES': 'Introduce el código generado en la aplicación',
  },
  'config.security_verify': {
    'pt-BR': 'Verificar',
    'en-US': 'Verify',
    'es-ES': 'Verificar',
  },
  'config.security_verifying': {
    'pt-BR': 'Verificando...',
    'en-US': 'Verifying...',
    'es-ES': 'Verificando...',
  },
  'config.security_active': {
    'pt-BR': 'Autenticação de dois fatores está ativa',
    'en-US': 'Two-factor authentication is active',
    'es-ES': 'La autenticación de dos factores está activa',
  },
  'config.success_language': {
    'pt-BR': 'Idioma alterado com sucesso',
    'en-US': 'Language changed successfully',
    'es-ES': 'Idioma cambiado con éxito',
  },
  'config.error_language': {
    'pt-BR': 'Ocorreu um erro ao alterar o idioma',
    'en-US': 'An error occurred while changing the language',
    'es-ES': 'Se produjo un error al cambiar el idioma',
  },
  'config.security_mfa_enabled': {
    'pt-BR': 'MFA ativado',
    'en-US': 'MFA enabled',
    'es-ES': 'MFA activado'
  },
  'config.security_mfa_setup_desc': {
    'pt-BR': 'Configure o aplicativo autenticador usando o QR Code.',
    'en-US': 'Set up your authenticator app using the QR Code.',
    'es-ES': 'Configure la aplicación de autenticación usando el código QR.'
  },
  'config.security_mfa_verified': {
    'pt-BR': 'MFA verificado',
    'en-US': 'MFA verified',
    'es-ES': 'MFA verificado'
  },
  'config.security_mfa_success': {
    'pt-BR': 'Autenticação de dois fatores ativada com sucesso.',
    'en-US': 'Two-factor authentication successfully enabled.',
    'es-ES': 'Autenticación de dos factores activada con éxito.'
  },
  'config.security_mfa_disabled': {
    'pt-BR': 'MFA desativado',
    'en-US': 'MFA disabled',
    'es-ES': 'MFA desactivado'
  },
  'config.security_mfa_disabled_desc': {
    'pt-BR': 'Autenticação de dois fatores desativada com sucesso.',
    'en-US': 'Two-factor authentication successfully disabled.',
    'es-ES': 'Autenticación de dos factores desactivada con éxito.'
  },
  'config.security_mfa_error': {
    'pt-BR': 'Erro ao configurar MFA',
    'en-US': 'Error configuring MFA',
    'es-ES': 'Error al configurar MFA'
  },
  'config.security_mfa_error_desc': {
    'pt-BR': 'Ocorreu um erro ao configurar a autenticação de dois fatores.',
    'en-US': 'An error occurred while configuring two-factor authentication.',
    'es-ES': 'Ocurrió un error al configurar la autenticación de dos factores.'
  },
  'config.security_code_error': {
    'pt-BR': 'O código deve conter 6 dígitos',
    'en-US': 'The code must contain 6 digits',
    'es-ES': 'El código debe contener 6 dígitos'
  },
  'config.security_code_secret': {
    'pt-BR': 'Código secreto',
    'en-US': 'Secret code',
    'es-ES': 'Código secreto'
  },
  'config.security_code_copied': {
    'pt-BR': 'Código copiado',
    'en-US': 'Code copied',
    'es-ES': 'Código copiado'
  },
  'config.security_code_copied_desc': {
    'pt-BR': 'O código secreto foi copiado para a área de transferência',
    'en-US': 'The secret code was copied to the clipboard',
    'es-ES': 'El código secreto fue copiado al portapapeles'
  },
  'config.security_code_manual': {
    'pt-BR': 'Se não conseguir escanear o QR code, digite este código no seu aplicativo.',
    'en-US': 'If you cannot scan the QR code, enter this code in your app.',
    'es-ES': 'Si no puede escanear el código QR, ingrese este código en su aplicación.'
  },
  'config.security_code_digit_desc': {
    'pt-BR': 'Digite o código de 6 dígitos exibido no seu aplicativo autenticador.',
    'en-US': 'Enter the 6-digit code shown in your authenticator app.',
    'es-ES': 'Ingrese el código de 6 dígitos que aparece en su aplicación de autenticación.'
  },
  'config.security_cancel': {
    'pt-BR': 'Cancelar',
    'en-US': 'Cancel',
    'es-ES': 'Cancelar'
  },
  'auth.mfa_verification': {
    'pt-BR': 'Verificação de autenticação de dois fatores',
    'en-US': 'Two-factor authentication verification',
    'es-ES': 'Verificación de autenticación de dos factores',
  },
  'auth.mfa_verification_description': {
    'pt-BR': 'Digite o código de 6 dígitos gerado pelo seu aplicativo autenticador',
    'en-US': 'Enter the 6-digit code generated by your authenticator app',
    'es-ES': 'Introduce el código de 6 dígitos generado por tu aplicación de autenticación',
  },
  'auth.mfa_code': {
    'pt-BR': 'Código de verificação',
    'en-US': 'Verification code',
    'es-ES': 'Código de verificación',
  },
  'auth.mfa_code_description': {
    'pt-BR': 'Abra seu aplicativo autenticador para ver o código',
    'en-US': 'Open your authenticator app to see the code',
    'es-ES': 'Abre tu aplicación de autenticación para ver el código',
  },
  'auth.mfa_error': {
    'pt-BR': 'Erro na verificação',
    'en-US': 'Verification error',
    'es-ES': 'Error de verificación',
  },
  'auth.mfa_code_invalid': {
    'pt-BR': 'Código inválido. Verifique e tente novamente.',
    'en-US': 'Invalid code. Please check and try again.',
    'es-ES': 'Código inválido. Por favor, verifica y vuelve a intentarlo.',
  },
  'auth.mfa_success': {
    'pt-BR': 'Verificação concluída',
    'en-US': 'Verification completed',
    'es-ES': 'Verificación completada',
  },
  'auth.mfa_verified': {
    'pt-BR': 'Autenticação de dois fatores verificada com sucesso',
    'en-US': 'Two-factor authentication successfully verified',
    'es-ES': 'Autenticación de dos factores verificada con éxito',
  },
  'auth.mfa_verification_failed': {
    'pt-BR': 'Falha na verificação do código. Tente novamente.',
    'en-US': 'Code verification failed. Please try again.',
    'es-ES': 'Error en la verificación del código. Inténtalo de nuevo.',
  },
  'auth.cancel': {
    'pt-BR': 'Cancelar',
    'en-US': 'Cancel',
    'es-ES': 'Cancelar',
  },
  'auth.verifying': {
    'pt-BR': 'Verificando...',
    'en-US': 'Verifying...',
    'es-ES': 'Verificando...',
  },
  'auth.verify': {
    'pt-BR': 'Verificar',
    'en-US': 'Verify',
    'es-ES': 'Verificar',
  },
}; 
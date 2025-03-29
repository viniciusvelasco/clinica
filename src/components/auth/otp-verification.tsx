"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Shield, Loader2 } from "lucide-react";
import { useTranslate } from "@/hooks/use-translate";

interface OTPVerificationProps {
  onVerify: (otp: string) => void;
  isLoading: boolean;
}

export function OTPVerification({ onVerify, isLoading }: OTPVerificationProps) {
  const { t } = useTranslate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  // Pré-preencher array de refs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);
  
  // Foca automaticamente no primeiro input ao montar
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);
  
  const handleChange = (value: string, index: number) => {
    // Permitir apenas dígitos
    if (!/^\d*$/.test(value)) return;
    
    // Atualizar o valor
    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1); // Pegar só o primeiro dígito
    setOtp(newOtp);
    
    // Mover para o próximo input se não for o último
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Backspace: limpa o input atual e volta para o anterior
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    }
    
    // Setas para navegação
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    
    // Filtrar apenas dígitos
    const digits = pastedData.replace(/\D/g, '').slice(0, 6);
    
    if (digits.length === 0) return;
    
    // Preencher os inputs
    const newOtp = [...otp];
    digits.split('').forEach((digit, index) => {
      if (index < 6) {
        newOtp[index] = digit;
      }
    });
    
    setOtp(newOtp);
    
    // Colocar foco no último input preenchido ou no próximo disponível
    const focusIndex = Math.min(digits.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };
  
  const handleVerify = () => {
    const otpValue = otp.join('');
    if (otpValue.length === 6) {
      onVerify(otpValue);
    }
  };
  
  const isCompleted = otp.every(digit => digit !== '');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Shield className="w-12 h-12 mx-auto text-primary mb-4" />
        <h3 className="text-lg font-semibold mb-2">{t('auth.mfa_verification')}</h3>
        <p className="text-sm text-gray-500 mb-6">
          {t('auth.mfa_verification_description')}
        </p>
      </div>
      
      {/* OTP Input */}
      <div className="space-y-4">
        <div className="flex justify-center space-x-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="w-12 h-14">
              <input
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={otp[index]}
                onChange={e => handleChange(e.target.value, index)}
                onKeyDown={e => handleKeyDown(e, index)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-full h-full text-center text-xl font-semibold border rounded-md focus:border-primary focus:ring-1 focus:ring-primary"
                autoComplete="one-time-code"
              />
            </div>
          ))}
        </div>
        
        <p className="text-xs text-center text-gray-500">
          {t('auth.mfa_code_description')}
        </p>
      </div>
      
      <Button
        onClick={handleVerify}
        className="w-full"
        disabled={!isCompleted || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t('auth.verifying')}
          </>
        ) : (
          <>
            <Shield className="mr-2 h-4 w-4" />
            {t('auth.verify')}
          </>
        )}
      </Button>
    </div>
  );
} 
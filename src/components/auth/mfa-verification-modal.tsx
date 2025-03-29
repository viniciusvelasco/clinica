"use client";

import { useState } from "react";
import { useTranslate } from "@/hooks/use-translate";
import { verifyMfaCode } from "@/actions/user";
import { toast } from "sonner";
import { Loader2, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OTPVerification } from "@/components/auth/otp-verification";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { signIn } from "next-auth/react";

interface MfaVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
  userId: string;
  mfaSecret: string;
}

export function MfaVerificationModal({
  isOpen,
  onClose,
  onVerified,
  userId,
  mfaSecret
}: MfaVerificationModalProps) {
  const { t } = useTranslate();
  const [verifying, setVerifying] = useState(false);
  
  const handleVerify = async (code: string) => {
    if (!code || code.length !== 6 || !/^\d+$/.test(code)) {
      toast.warning(t('auth.mfa_error'), {
        description: t('auth.mfa_code_invalid')
      });
      return;
    }
    
    setVerifying(true);
    
    try {
      const result = await verifyMfaCode(userId, mfaSecret, code);
      
      if (result.success) {
        try {
          const signInResult = await signIn("credentials", {
            redirect: false,
            mfaCode: code
          });
          
          if (!signInResult?.error) {
            toast.success(t('auth.mfa_success'), {
              description: t('auth.mfa_verified')
            });
            onVerified();
          } else {
            toast.error(t('auth.mfa_error'), {
              description: t('auth.mfa_verification_failed')
            });
          }
        } catch (signInError) {
          console.error("Erro ao completar login após MFA:", signInError);
          toast.error(t('auth.mfa_error'), {
            description: t('auth.mfa_verification_failed')
          });
        }
      } else {
        toast.error(t('auth.mfa_error'), {
          description: result.message || t('auth.mfa_verification_failed')
        });
      }
    } catch (error) {
      toast.error(t('auth.mfa_error'), {
        description: error instanceof Error 
          ? error.message 
          : t('auth.mfa_verification_failed')
      });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('auth.mfa_verification')}</DialogTitle>
          <DialogDescription>
            {t('auth.mfa_verification_description')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <OTPVerification 
            onVerify={handleVerify}
            isLoading={verifying}
          />
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={verifying}
          >
            <X className="mr-2 h-4 w-4" />
            {t('auth.cancel')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 
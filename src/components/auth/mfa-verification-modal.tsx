"use client";

import { useState } from "react";
import { useTranslate } from "@/hooks/use-translate";
import { verifyMfaCode } from "@/actions/user";
import { toast } from "sonner";
import { Loader2, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  
  const handleVerify = async () => {
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
      setCode("");
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
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="mfa-code">
              {t('auth.mfa_code')}
            </Label>
            <Input
              id="mfa-code"
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
              className="font-mono text-center text-lg tracking-widest"
              maxLength={6}
              autoComplete="one-time-code"
            />
            <p className="text-xs text-muted-foreground">
              {t('auth.mfa_code_description')}
            </p>
          </div>
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
          <Button
            onClick={handleVerify}
            disabled={verifying || !code || code.length !== 6}
          >
            {verifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('auth.verifying')}
              </>
            ) : (
              <>
                <ShieldCheck className="mr-2 h-4 w-4" />
                {t('auth.verify')}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 
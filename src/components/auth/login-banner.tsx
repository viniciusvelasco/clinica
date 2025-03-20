"use client";

import Image from "next/image";

export default function LoginBanner() {
  return (
    <div className="relative h-full bg-primary/10 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/medical-team.jpg"
          alt="Equipe médica"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/70 to-transparent" />
      </div>
      <div className="relative z-10 flex flex-col justify-center h-full p-16 max-w-3xl">
        <div className="space-y-8">
          <div>
            <h1 className="text-5xl font-bold text-white mb-6">
              {process.env.NEXT_PUBLIC_SYSTEM_NAME}
            </h1>
            <p className="text-2xl text-white/90">
              Transformando a gestão da sua clínica com tecnologia e inovação
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 space-y-6">
            <p className="text-lg text-white/90">
              Simplifique processos, otimize agendamentos e melhore a experiência dos seus pacientes com nossa solução completa.
            </p>
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">+1000</div>
                <div className="text-sm text-white/80 mt-1">Pacientes Atendidos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">98%</div>
                <div className="text-sm text-white/80 mt-1">Satisfação</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">-30%</div>
                <div className="text-sm text-white/80 mt-1">Tempo de Espera</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
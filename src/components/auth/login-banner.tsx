"use client";

import Image from "next/image";
import React from "react";
import { features, Feature } from "./login-features";

export function LoginBanner() {
  const systemName = process.env.NEXT_PUBLIC_SYSTEM_NAME || "Sistema Médico";

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center bg-[#3A86FF] overflow-hidden">
      {/* Imagem de fundo com overlay */}
      <div className="absolute inset-0">
        <Image
          src="/images/medical-banner.jpg"
          alt="Equipe médica"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/75 via-primary/90 to-transparent" />
      </div>

      {/* Conteúdo sobreposto */}
      <div className="relative z-10 text-center px-6 py-8 max-w-3xl mx-auto">
        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 lg:mb-6 tracking-tight">
          {systemName}
        </h1>
        <p className="text-lg lg:text-xl text-white/80 mb-6 lg:mb-8 leading-relaxed">
          Um sistema completo para gestão de clínicas médicas, proporcionando
          atendimento de qualidade aos seus pacientes.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mt-8 lg:mt-12">
          {features.map((feature: Feature, index: number) => (
            <div key={index} className="text-center">
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm mb-2 lg:mb-3 mx-auto w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="text-white font-medium mb-1">{feature.title}</h3>
              <p className="text-white/70 text-xs lg:text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Destaque amarelo para decoração */}
      <div className="absolute bottom-8 right-8 w-20 h-20 rounded-full bg-[#FFD166]/30 backdrop-blur-sm"></div>
      <div className="absolute top-12 left-12 w-16 h-16 rounded-full bg-[#FFD166]/20 backdrop-blur-sm"></div>
    </div>
  );
} 
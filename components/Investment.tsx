'use client';

import { motion } from 'motion/react';
import { Check, CreditCard, ShieldCheck, AlertCircle } from 'lucide-react';

export default function Investment() {
  const benefits = [
    "Material didático exclusivo",
    "Certificado de 16 horas-aula",
    "Acesso a grupo VIP para networking",
    "Coffee break nos dois dias de curso",
    "Interação direta com os professores",
    "Atualização focada na jurisprudência recente"
  ];

  return (
    <section id="investimento" className="py-24 relative bg-slate-900/40">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#28a745]/30 text-[#28a745] bg-transparent w-fit mx-auto mb-5">
            <Check className="w-4 h-4" />
            <span className="text-xs font-semibold tracking-wide">Garanta sua Vaga</span>
          </div>
          <h3 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">BENEFÍCIOS E INVESTIMENTO</h3>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto font-medium">
            Invista na sua carreira com a melhor atualização jurídica do mercado.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-panel-dark border border-white/5 p-8 md:p-12 rounded-3xl flex flex-col"
          >
            <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6 text-orange-400 border border-orange-500/20">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h4 className="text-3xl font-bold text-white mb-8 tracking-tight">O que está incluso</h4>
            <ul className="space-y-6 flex-grow">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-4 text-slate-300 font-medium">
                  <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  <span className="text-lg">{benefit}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-panel-dark p-8 md:p-12 rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-900/20 to-transparent flex flex-col relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#28a745]/30 text-[#28a745] bg-transparent">
                <AlertCircle className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold tracking-wide">Vagas Limitadas</span>
              </div>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-orange-600 flex items-center justify-center mb-6 text-white shadow-lg shadow-orange-500/30">
              <CreditCard className="w-8 h-8" />
            </div>
            <h4 className="text-3xl font-bold text-white mb-2 tracking-tight">Investimento</h4>
            <p className="text-slate-400 mb-8 font-medium">Lote atual disponível</p>

            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl text-slate-400 font-bold">R$</span>
                <span className="text-6xl font-black text-white tracking-tighter">1.997</span>
                <span className="text-xl text-slate-400 font-bold">,00</span>
              </div>
              <p className="text-orange-400 mt-2 font-semibold">Em até 12x no cartão de crédito</p>
            </div>

            <div className="space-y-4 flex-grow font-medium">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                <span className="text-slate-300">Cartão de Crédito</span>
                <span className="text-white">Até 12x</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                <span className="text-slate-300">PIX</span>
                <span className="text-emerald-400">5% de desconto</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                <span className="text-slate-300">Boleto Bancário</span>
                <span className="text-white">À vista</span>
              </div>
            </div>

            <button className="w-full mt-8 glass-button">
              Realizar Inscrição Agora
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

'use client';

import { motion } from 'motion/react';
import { Users, Briefcase, Gavel, Scale, GraduationCap, Landmark } from 'lucide-react';

export default function TargetAudience() {
  const audiences = [
    { icon: <Users className="w-8 h-8" />, title: "Agentes Públicos" },
    { icon: <Briefcase className="w-8 h-8" />, title: "Advogados e Assessores" },
    { icon: <Landmark className="w-8 h-8" />, title: "Procuradores" },
    { icon: <Gavel className="w-8 h-8" />, title: "Promotores de Justiça" },
    { icon: <Scale className="w-8 h-8" />, title: "Magistrados" },
    { icon: <GraduationCap className="w-8 h-8" />, title: "Pós-graduandos" }
  ];

  return (
    <section className="py-24 relative bg-slate-900">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#28a745]/30 text-[#28a745] bg-transparent w-fit mx-auto mb-5">
            <Users className="w-4 h-4" />
            <span className="text-xs font-semibold tracking-wide">Público-Alvo</span>
          </div>
          <h3 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">PRA QUEM É ESSE CURSO?</h3>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Destinado a profissionais que atuam na área do Direito Administrativo e Direito Eleitoral.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {audiences.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-panel-dark border border-white/5 p-8 rounded-3xl flex flex-col items-center text-center gap-4 hover:bg-orange-900/10 hover:border-orange-500/30 transition-all duration-300 group"
            >
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-orange-400 group-hover:scale-110 group-hover:text-orange-300 transition-all duration-300 shadow-lg border border-orange-500/20">
                {item.icon}
              </div>
              <h4 className="text-lg font-bold text-white tracking-wide">{item.title}</h4>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

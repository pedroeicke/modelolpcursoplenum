'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Download, CheckCircle2, FileText } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function FolderForm() {
    const sectionRef = useRef<HTMLElement>(null);
    const [submitted, setSubmitted] = useState(false);
    const [form, setForm] = useState({
        nome: '',
        email: '',
        estado: '',
        cidade: '',
        orgao: '',
        captcha: '',
    });

    useEffect(() => {
        if (!sectionRef.current) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.folder-anim',
                { y: 30, autoAlpha: 0 },
                {
                    y: 0,
                    autoAlpha: 1,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    const estados = [
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
        'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
    ];

    const inputClasses = "w-full px-4 py-3 rounded-lg bg-[#071428] border border-white/5 text-white text-[13px] placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors";
    const labelClasses = "text-white/80 text-[10px] uppercase font-bold tracking-widest block mb-2";

    return (
        <section ref={sectionRef} id="folder" className="py-24 md:py-32 px-6 md:px-12 relative overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img src="/bgfrm.png" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">

                {/* Left side - Text */}
                <div className="flex flex-col">
                    <div className="folder-anim inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#28a745]/30 text-[#28a745] bg-transparent w-fit mb-8">
                        <Download className="w-4 h-4" />
                        <span className="text-xs font-semibold tracking-wide">Material Exclusivo</span>
                    </div>

                    <h2 className="folder-anim font-[var(--font-bricolage)] text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-white tracking-tight leading-[1.1] mb-6">
                        BAIXE O FOLDER<br />
                        <span className="text-[#28a745]">COMPLETO DO EVENTO</span>
                    </h2>

                    <p className="folder-anim text-white/60 text-base md:text-lg leading-relaxed max-w-[480px] mb-10">
                        Tenha acesso a todos os detalhes técnicos, programação detalhada hora a hora, currículo completo dos palestrantes e informações de investimento.
                    </p>

                    <div className="folder-anim inline-flex items-center gap-4 px-6 py-4 rounded-xl border border-white/10 bg-white/[0.02] w-fit">
                        <FileText className="w-6 h-6 text-[#28a745]" />
                        <div className="flex flex-col">
                            <span className="text-white font-bold text-sm">PDF Completo</span>
                            <span className="text-white/40 text-xs">Versão Atualizada</span>
                        </div>
                    </div>
                </div>

                {/* Right side - Form Box */}
                <div className="folder-anim">
                    <div className="rounded-3xl p-8 md:p-10 bg-white/[0.08] backdrop-blur-xl border border-white/[0.12] shadow-[0_4px_30px_rgba(0,0,0,0.15)]">
                        {submitted ? (
                            <div className="text-center py-16 flex flex-col items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-[#28a745]/10 flex items-center justify-center">
                                    <CheckCircle2 className="w-8 h-8 text-[#28a745]" />
                                </div>
                                <h3 className="font-[var(--font-bricolage)] text-2xl font-bold text-white">Enviado com sucesso!</h3>
                                <p className="text-white/50 text-sm max-w-[280px]">O folder será enviado para o seu e-mail em instantes.</p>
                            </div>
                        ) : (
                            <>
                                <div className="mb-8">
                                    <h3 className="font-[var(--font-bricolage)] text-2xl font-bold text-white mb-2">PREENCHA SEUS DADOS</h3>
                                    <p className="text-white/50 text-[13px]">Download imediato após o preenchimento.</p>
                                </div>

                                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                    <div>
                                        <label className={labelClasses}>Nome Completo *</label>
                                        <input type="text" name="nome" required value={form.nome} onChange={handleChange} placeholder="Seu nome" className={inputClasses} />
                                    </div>

                                    <div>
                                        <label className={labelClasses}>Email Corporativo *</label>
                                        <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="seu@email.com" className={inputClasses} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className={labelClasses}>Estado *</label>
                                            <select name="estado" required value={form.estado} onChange={handleChange} className={`${inputClasses} appearance-none cursor-pointer group-hover:bg-white/5`}>
                                                <option value="" className="bg-[#0a1a33]">UF</option>
                                                {estados.map((uf) => (
                                                    <option key={uf} value={uf} className="bg-[#0a1a33]">{uf}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className={labelClasses}>Cidade *</label>
                                            <input type="text" name="cidade" required value={form.cidade} onChange={handleChange} placeholder="Cidade" className={inputClasses} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className={labelClasses}>Órgão Representante</label>
                                        <select name="orgao" required value={form.orgao} onChange={handleChange} className={`${inputClasses} appearance-none cursor-pointer`}>
                                            <option value="" className="bg-[#0a1a33]">Selecione o tipo</option>
                                            <option value="Prefeitura" className="bg-[#0a1a33]">Prefeitura</option>
                                            <option value="Câmara" className="bg-[#0a1a33]">Câmara Municipal</option>
                                            <option value="Governo Estadual" className="bg-[#0a1a33]">Governo Estadual</option>
                                            <option value="Outro" className="bg-[#0a1a33]">Outro</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className={labelClasses}>Quanto é 1 + 1? *</label>
                                        <input type="text" name="captcha" required value={form.captcha} onChange={handleChange} placeholder="Responda o número" className={inputClasses} />
                                    </div>

                                    <button type="submit" className="btn-primary w-full mt-4 !text-[15px] !uppercase !tracking-wider">
                                        Baixar Agora
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>

            </div>
        </section>
    );
}

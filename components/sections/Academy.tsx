"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { COURSE_AREAS } from "@/lib/plenum-content";
import type { SiteCourse } from "@/lib/courses-db";

const FILTERS = ["Todos", ...COURSE_AREAS];

export default function Academy({ courses = [] }: { courses?: SiteCourse[] }) {
    const sectionRef = useRef<HTMLElement>(null);
    const [activeNucleo, setActiveNucleo] = useState("Todos");

    // cursos com turma futura, já ordenados por data (courses-db) → 3 mais próximos do núcleo
    const upcoming = courses.filter(
        (c) => c.startDate && new Date(c.startDate).getTime() >= Date.now() - 24 * 60 * 60 * 1000
    );
    const filteredCourses = (activeNucleo === "Todos"
        ? upcoming
        : upcoming.filter((c) => c.area === activeNucleo)
    ).slice(0, 3);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".academy-header", {
                y: 40, opacity: 0, duration: 0.7, ease: "power3.out",
                scrollTrigger: { trigger: ".academy-section", start: "top 80%" }
            });
            gsap.from(".academy-grid", {
                y: 60, opacity: 0, duration: 0.9, ease: "power3.out",
                scrollTrigger: { trigger: ".academy-grid", start: "top 85%" }
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="academy" ref={sectionRef} className="academy-section bg-[#F1F1F1] py-14 lg:py-32">
            <div className="max-w-[1280px] mx-auto px-4">
                <div className="academy-header text-center mb-12 lg:mb-16">
                    <p className="text-label text-[#8a6e1a] mb-3">Plenum Academy</p>
                    <h2 className="text-display-lg text-[#030D1F] mb-4 max-w-4xl mx-auto">Formação executiva para todas<br className="hidden md:block" /> as esferas do setor público</h2>
                    <p className="text-body text-[#555] max-w-2xl mx-auto mb-8">
                        Cursos presenciais e híbridos para servidores, lideranças, municípios, órgãos de controle, estatais e legislativos.
                    </p>
                    <div className="overflow-x-auto hide-scrollbar -mx-6 px-6 lg:mx-0 lg:px-0">
                        <div className="flex lg:flex-wrap lg:justify-center gap-2 lg:gap-3 min-w-max lg:min-w-0">
                            {FILTERS.map((nucleo) => (
                                <button
                                    key={nucleo}
                                    onClick={() => setActiveNucleo(nucleo)}
                                    className={`filter-chip ${activeNucleo === nucleo ? "active" : ""}`}
                                >
                                    {nucleo}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="academy-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                    {filteredCourses.map((course) => (
                        <a
                            key={course.id}
                            href={course.url}
                            className="group relative block h-[450px] sm:h-[490px] lg:h-[520px] rounded-[20px] sm:rounded-[24px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.25)] hover:shadow-[0_24px_60px_rgba(0,0,0,0.35),0_0_0_3px_rgba(255,255,255,0.9),0_0_40px_rgba(201,162,39,0.5)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                        >
                            <img
                                src={course.image}
                                alt={course.title}
                                className="absolute inset-0 w-full h-full object-cover group-hover:brightness-[1.08] transition-[filter] duration-300"
                                draggable={false}
                            />
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-[0.18] transition-opacity duration-300 pointer-events-none z-[5]" />
                            {/* capa própria: a arte já traz título/data — só as pills por cima */}
                            {!course.hasCover && <div className="absolute inset-0 bg-gradient-to-t from-[#030D1F]/92 via-[#030D1F]/35 to-[#030D1F]/5" />}

                            <div className="absolute top-5 left-5 right-5 z-10 flex items-start justify-between gap-3">
                                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-semibold tracking-widest text-white uppercase">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]" />
                                    {course.area}
                                </span>
                                <span className="inline-flex px-3 py-1.5 bg-[#030D1F]/45 border border-white/15 rounded-full text-[10px] font-semibold tracking-wider uppercase text-white/80">
                                    {course.modality}
                                </span>
                            </div>

                            {!course.hasCover && (
                            <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                                <p className="text-[12px] text-white/50 mb-2">{course.professor}</p>
                                <h4 className="text-[20px] lg:text-[23px] font-display font-semibold text-white leading-tight mb-3">
                                    {course.title}
                                </h4>
                                <p className="text-[13px] text-white/60 leading-relaxed mb-4">{course.description}</p>

                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar className="w-4 h-4 text-[#C9A227]" />
                                    <span className="text-[14px] font-semibold text-white tracking-wide">
                                        {course.date}{course.workload ? ` · ${course.workload}` : ""}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 mb-4">
                                    <MapPin className="w-4 h-4 text-[#C9A227]" />
                                    <span className="text-[14px] font-semibold text-white tracking-wide">
                                        {course.location}
                                    </span>
                                </div>

                                <div className="flex justify-end">
                                    <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/25 rounded-full text-[12px] font-semibold text-white tracking-wider uppercase group-hover:bg-white/20 transition-all">
                                        Ver Curso <ArrowRight className="w-3.5 h-3.5" />
                                    </span>
                                </div>
                            </div>
                            )}
                        </a>
                    ))}
                </div>
                {filteredCourses.length === 0 && (
                    <div className="text-center text-sm text-[#555]">
                        Nenhum curso com turma aberta neste núcleo no momento.
                    </div>
                )}

                <div className="text-center mt-12">
                    <a href="/cursos" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-[#030D1F] text-[#030D1F] text-sm font-semibold uppercase tracking-wider hover:bg-[#030D1F] hover:text-white transition-all duration-300">
                        Ver todos os cursos
                        <ArrowRight className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </section>
    );
}

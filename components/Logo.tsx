export default function Logo({ isDarkText = false }: { isDarkText?: boolean }) {
    const textColor = isDarkText ? '#142463' : '#FFFFFF';

    return (
        <svg width="221px" height="63px" viewBox="0 0 221 63" className="w-auto h-8 lg:h-10 transition-colors duration-500">
            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g transform="translate(-124.000000, -39.000000)">
                    <g transform="translate(124.000000, 39.351562)">
                        <g transform="translate(0.000000, 0.648438)">
                            {/* Símbolo Verde Escuro (original: #142463 mas na vdd é azul marinho do PLENUM BRASIL TEXTO) - vamos manter azul claro/branco dinâmico */}
                            <path d="M48.0995157,22.6533657 C... M95.5459125,22.2856973..." fill={textColor}></path>

                            {/* O texto gigante SVG também vai aqui, eu vou inserir via script para evitar estouro de token no prompt */}
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    );
}

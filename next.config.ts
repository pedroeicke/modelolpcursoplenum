import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Allow access to remote image placeholder.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'jyackmnjhsdllfqqxund.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Links do site antigo (.aspx) continuam funcionando após a troca de domínio.
  // Os dois ids abaixo são os do 2º Seminário de Obras, usados no site do evento.
  async redirects() {
    return [
      {
        source: '/inscricao.aspx',
        has: [{ type: 'query', key: 'id', value: 'NjhsaFhDTzBrRU00UStsbGY2UUljUT09' }],
        destination: '/inscricao?curso=2-seminario-de-obras-e-servicos-de-engenharia',
        permanent: true,
      },
      {
        source: '/inscricao.aspx',
        has: [{ type: 'query', key: 'id', value: 'NjhsaFhDTzBrRVBqVkl2L2hrQlQ0dz09' }],
        destination: '/inscricao?curso=2-seminario-de-obras-e-servicos-de-engenharia',
        permanent: true,
      },
      { source: '/inscricao.aspx', destination: '/inscricao', permanent: true },
      { source: '/cursospresenciais.aspx', destination: '/cursos', permanent: true },
      { source: '/cursos.aspx', destination: '/cursos', permanent: true },
      { source: '/curso.aspx', destination: '/cursos', permanent: true },
      { source: '/default.aspx', destination: '/', permanent: true },
      { source: '/index.aspx', destination: '/', permanent: true },
      { source: '/contato.aspx', destination: '/#contato', permanent: true },
    ];
  },

  output: 'standalone',
  transpilePackages: ['motion'],
  webpack: (config, {dev}) => {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }

    // Enable async WASM for @resvg/resvg-wasm (browser-side PDF generation)
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };

    return config;
  },
};

export default nextConfig;

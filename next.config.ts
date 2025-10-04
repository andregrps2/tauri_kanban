const nextConfig = {
  output: 'export', // Gera site estático
  basePath: process.env.GITHUB_PAGES ? '/tauri_kanban' : '', // Ajusta o caminho base para o GitHub Pages
  assetPrefix: process.env.GITHUB_PAGES ? '/tauri_kanban/' : '',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, // Evita problemas com imagens no export
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Suppress hydration warnings from browser extensions
  reactStrictMode: true,
  
  // Custom webpack config to handle browser extension warnings
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Suppress common browser extension hydration warnings in development
      const originalWarn = console.warn;
      console.warn = (...args) => {
        const message = args[0];
        if (
          typeof message === 'string' &&
          (message.includes('data-protonpass') ||
           message.includes('data-lastpass') ||
           message.includes('data-1password') ||
           message.includes('data-bitwarden') ||
           message.includes('Extra attributes from the server'))
        ) {
          return; // Suppress these warnings
        }
        originalWarn.apply(console, args);
      };
    }
    return config;
  }
}

module.exports = nextConfig

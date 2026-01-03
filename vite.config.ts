import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Production optimizations
    minify: mode === 'production' ? 'terser' : false,
    sourcemap: mode === 'development',
    rollupOptions: {
      output: {
        // Obfuscate chunk names in production
        chunkFileNames: mode === 'production' 
          ? 'assets/[hash].js' 
          : 'assets/[name]-[hash].js',
        entryFileNames: mode === 'production'
          ? 'assets/[hash].js'
          : 'assets/[name]-[hash].js',
        assetFileNames: mode === 'production'
          ? 'assets/[hash].[ext]'
          : 'assets/[name]-[hash].[ext]',
        // Manual chunk splitting for better caching
        manualChunks: mode === 'production' ? {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          'vendor-utils': ['framer-motion', 'date-fns'],
        } : undefined,
      },
    },
    // Reduce bundle size
    chunkSizeWarningLimit: 1000,
    // Tree shaking
    treeshake: {
      moduleSideEffects: false,
    },
  },
  // Remove console logs in production
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : [],
  },
}));

import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
// import mkcert from 'vite-plugin-mkcert';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = Object.assign(process.env, loadEnv(mode, process.cwd(), ''));

  return defineConfig({
    plugins: [react(), tsconfigPaths()],
    base: '/kulupyonetim/',
    server: {
      port: 3000,
      proxy: {
        [process.env.VITE_API_PATH]: {
          target: 'http://localhost:5130', // Update this to match your ASP.NET Core backend server URL
          changeOrigin: true,
        },
      },
    },
  });
};

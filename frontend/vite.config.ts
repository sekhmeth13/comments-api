import { svelte } from '@sveltejs/vite-plugin-svelte'
import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
export default {
  server: { https: true },
  plugins: [mkcert(), svelte()]
}
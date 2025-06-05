import { defineConfig, type ProxyOptions } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const proxyPaths = [
	'/auth',
]

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'store': path.resolve(__dirname, 'src/store'),
      'components': path.resolve(__dirname, 'src/components'),
      'types': path.resolve(__dirname, 'src/types'),
      'validation': path.resolve(__dirname, 'src/validation'),
      'services': path.resolve(__dirname, 'src/services')
    }
  },
  server: {
    port: 3000,
    open: true,
    proxy: proxyPaths.reduce((acc, proxyPath) => {
			acc[proxyPath] = {
				target: 'http://streaming.nexlesoft.com:3001',
				changeOrigin: true,
			}
			return acc
		}, {} as Record<string, ProxyOptions>),
  }
})

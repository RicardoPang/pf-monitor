import { defineConfig, Plugin, ViteDevServer } from 'vite'

// 创建一个自定义插件来模拟 webpack 的 before 功能
const mockServerPlugin = (): Plugin => ({
  name: 'mock-server',
  configureServer(server: ViteDevServer) {
    server.middlewares.use((req, res, next) => {
      if (req.url === '/success' && req.method === 'GET') {
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ id: 1 }))
        return
      }
      if (req.url === '/error' && req.method === 'POST') {
        res.statusCode = 500
        res.end()
        return
      }
      next()
    })
  }
})

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: './index.ts',
      output: [
        {
          format: 'es', // 输出格式为 ES 模块
          dir: 'dist/es',
          entryFileNames: '[name].js',
          preserveModules: true, // 保留原来目录结构
          preserveModulesRoot: '.',
          assetFileNames: '[name][extname]'
        },
        {
          format: 'commonjs', // 输出格式为 CommonJS 模块
          dir: 'dist/lib',
          entryFileNames: '[name].js',
          preserveModules: true,
          preserveModulesRoot: '.',
          assetFileNames: '[name][extname]'
        },
        {
          format: 'es',
          dir: 'dist',
          entryFileNames: '[name].mjs', // 输出单文件
          assetFileNames: '[name][extname]'
        },
        {
          format: 'commonjs',
          dir: 'dist',
          entryFileNames: '[name].js',
          assetFileNames: '[name][extname]'
        }
      ],
      preserveEntrySignatures: 'strict' // 保留入口签名
    },
    sourcemap: true, // 生成 source map，对应到具体代码
    emptyOutDir: false
  },
  plugins: [mockServerPlugin()],
  server: {
    port: 3000,
    open: true
  }
})

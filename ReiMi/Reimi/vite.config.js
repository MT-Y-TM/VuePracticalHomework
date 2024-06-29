import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        // 其他需要自动导入的库
      ],
    }),
    Components({
      // 配置需要自动注册的组件
      dts: true,
      resolvers: [
        (name) => {
          if (name.startsWith('Base')) {
            return { importName: name.slice(4), path: `@/components/${name}.vue` }
          }
        },
      ],
    }),
  ],
})

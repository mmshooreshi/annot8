// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'
import ViteComponents from 'unplugin-vue-components/vite'
import IconsResolver from 'unplugin-icons/resolver'

export default defineNuxtConfig({
  ssr: true,
  devtools: { enabled: true },

  app: {
    head: {
      title: 'A Better Nuxt 3 Starter',
      link: [{ rel: 'icon', type: 'image/*', href: '/favicon.svg' }]
    }
  },

  modules: [
    '@unocss/nuxt',
    '@pinia/nuxt',
    'unplugin-icons/nuxt',
    '@vueuse/nuxt'
  ],

  vite: {
    plugins: [
      ViteComponents({
        resolvers: [
          IconsResolver({
            componentPrefix: ''
          })
        ],
        dts: true
      })
    ]
  },

  runtimeConfig: {
    public: {
      videoPath: process.env.VIDEO_PATH || 'data/videos' // Default to ./videos
    }
  },

  compatibilityDate: '2024-12-12'
})
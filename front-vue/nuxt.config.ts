// https://nuxt.com/docs/api/configuration/nuxt-config
import {process} from "std-env";

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  modules: ['@nuxt/icon', '@nuxt/fonts'],
  plugins: ['~/plugins/api-client.ts'],
  ssr: false,
  appConfig: {
    baseURL: process.env.BASE_URL || 'http://coloc-backend-1:3000',
  },
  app: {
    baseURL: "/"
  }
})
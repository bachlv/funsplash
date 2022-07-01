import { defineNuxtConfig } from 'nuxt';

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  runtimeConfig: {
    cacheMaxAge: process.env.NODE_ENV === 'development' ? 1 : 3600,
    resultPerCall: 10,
    public: {
      apiBase: '/api',
    },
  },
});

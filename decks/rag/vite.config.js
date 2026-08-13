import { defineConfig } from 'vite';

export default defineConfig({
  // Decks are served from a subpath of the deployment (the domain maps
  // /decks/<deck>/dist as the site root, previews browse via alias URLs),
  // so all asset URLs must be relative.
  base: './',
  server: {
    port: 5180,
  },
});

import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  extensionApi: "chrome",
  modules: ["@wxt-dev/module-svelte"],
  hooks: {
    "build:manifestGenerated": (wxt, manifest) => {
      manifest.content_scripts ??= [];
      manifest.content_scripts.push({
        css: ["content-scripts/pinterest.css"],
        matches: ["*://*.pinterest.com/*"],
      });
    },
  },
});

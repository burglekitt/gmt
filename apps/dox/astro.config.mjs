// @ts-check
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

// DOX-A2 deploys to Cloudflare Workers' default *.workers.dev subdomain (no
// custom domain yet). `site` must be set or @astrojs/sitemap (a Starlight
// dependency) warns on every build.
const SITE = "https://gmt-dox.northguild.workers.dev";

export default defineConfig({
  site: SITE,
  markdown: {
    shikiConfig: {
      theme: "github-dark",
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      wrap: false,
    },
  },
  integrations: [
    starlight({
      title: "@northguild/gmt",
      description:
        "Temporal-first date and time utilities with timezone support and polyfill integration.",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/northguild/gmt",
        },
      ],
      editLink: {
        baseUrl: "https://github.com/northguild/gmt/edit/main/apps/dox/",
      },
      // Preload the self-hosted display font (vendored to `public/fonts/`, see
      // mg-theme.css). Without this the browser only discovers the @font-face
      // after the CSS bundle parses, so the site title and every heading
      // reflow out of the mono fallback on each navigation — the "header flash".
      head: [
        {
          tag: "link",
          attrs: {
            rel: "preload",
            href: "/fonts/michroma-latin-400-normal.woff2",
            as: "font",
            type: "font/woff2",
            crossorigin: "anonymous",
          },
        },
      ],
      sidebar: [
        {
          label: "Start here",
          items: [{ slug: "install" }, { slug: "core-rules" }],
        },
        // `collapsed` so only the current namespace/module branch is expanded
        // on load — the reference tree is ~600 entries and rebuilding the whole
        // expanded DOM on every navigation is a measurable chunk of the jank.
        {
          label: "Reference",
          items: [{ autogenerate: { directory: "reference", collapsed: true } }],
        },
      ],
      components: {
        SocialIcons: './src/components/SocialIcons.astro',
        ThemeProvider: './src/components/ThemeProvider.astro',
        ThemeSelect: './src/components/ThemeSelect.astro',
      },
      customCss: [
        "./src/styles/mg-theme.css",
        "./src/styles/mg-glass.css",
        "./src/styles/mg-site.css",
      ],
    }),
  ],
});

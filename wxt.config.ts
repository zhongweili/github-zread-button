import { defineConfig } from 'wxt';

export default defineConfig({
  manifest: {
    name: 'GitHub Zread Button',
    description: 'Adds a Zread.ai button to GitHub repository pages',
    version: '1.0.0',
    permissions: [],
    host_permissions: ['https://github.com/*'],
    icons: {
      16: 'icon/icon-16.png',
      32: 'icon/icon-32.png',
      48: 'icon/icon-48.png',
      128: 'icon/icon-128.png',
    },
    web_accessible_resources: [
      {
        resources: ['icon/icon-16.png', 'content-scripts/content.css'],
        matches: ['https://github.com/*'],
      },
    ],
  },
  srcDir: '.',
});

import { defineConfig } from 'wxt';

export default defineConfig({
  manifest: {
    name: 'GitHub Zread Button',
    description: 'Adds a Zread.ai button to GitHub repository pages',
    version: '1.0.0',
    permissions: [],
    host_permissions: ['https://github.com/*'],
    web_accessible_resources: [
      {
        resources: ['icon/zread-icon.svg', 'content-scripts/content.css'],
        matches: ['https://github.com/*'],
      },
    ],
  },
  srcDir: '.',
});

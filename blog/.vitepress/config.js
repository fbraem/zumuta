import { defineConfig } from "vitepress";

export default defineConfig({
    title: 'Zumuta!',
    description: "That's the way to do IT",
    markdown: {
        anchor: {
            permalink: false
        }
    },
    themeConfig: {
        repo: 'fbraem/zumuta',
        docsDir: 'blog',
        docsBranch: 'master',
        editLinks: true,
        editLinkText: 'Edit this page on Github',
        lastUpdated: 'Last Updated'
    }
})

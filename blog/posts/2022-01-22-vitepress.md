---
layout: blog
date: 2022-01-22
title: Vitepress
---

After using [Jekyll](http://jekyllrb.com/) for more than 10 years, **Zumuta!** is now build with
[vitepress](https://vitepress.vuejs.org/).

---

It was about time to learn using a new static website generator. Vitepress was selected
because I already use [vite](https://vitejs.dev/) and [tailwindcss](https://tailwindcss.com/) for
[kwai-vite](https://github.com/fbraem/kwai-vite), the front-end of [kwai-api](https://github.com/fbraem/kwai-api).

Vitepress is still a work in progress, but eventually it will become the successor of
[Vuepress](https://vuepress.vuejs.org/).

Vitepress uses [Vite](https://vitejs.dev/). Vite is a build tool for modern web
projects. It contains a dev server and uses [Rollup](https://rollupjs.org/) to 
bundle the code of the website. If you, like me, struggled to get Webpack up and
running, then Vite is a relief. Just compare the old [Webpack configuration](https://github.com/fbraem/kwai-ui/blob/master/webpack.config.js)
with the new [Vite configuration](https://github.com/fbraem/kwai-vite/blob/master/vite.config.js), and you
see what I mean. I switched to Vite and never looked back.

> **Vite** is the French word for **quick**.

<template>
  <div>
    <Nav />
    <main class="container mx-auto">
      <section class="px-5 sm:px-10">
        <Home v-if="$frontmatter.layout === 'home'" />
        <template v-else-if="$frontmatter.layout === 'cycling'">
          <CyclingIndex v-if="$frontmatter.index" />
          <Cycling v-else />
        </template>
        <template v-else-if="$frontmatter.layout === 'blog'">
          <PageIndex v-if="$frontmatter.index" />
          <Article v-else />
        </template>
        <Page v-else />
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {useData, useRoute} from 'vitepress'
import Home from './Home.vue'
import Article from './Article.vue'
import Nav from './Nav.vue'
import Page from './Page.vue'
import PageIndex from './PageIndex.vue'
import Cycling from "./Cycling.vue"
import CyclingIndex from "./CyclingIndex.vue";
const data = useData();
const route = useRoute()
const isIndex = computed(() => route.path.replace(/index.html$/, '') === '/')
</script>

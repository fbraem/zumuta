<script setup>
import Date from './Date.vue'
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'
import { data as posts } from '../posts.data.js'

const { frontmatter: data } = useData()

const route = useRoute()

function findCurrentIndex() {
  return posts.findIndex((p) => p.href === route.path)
}

// use the customData date which contains pre-resolved date info
const date = computed(() => posts[findCurrentIndex()].date)
const nextPost = computed(() => posts[findCurrentIndex() - 1])
const prevPost = computed(() => posts[findCurrentIndex() + 1])
</script>

<template>
  <div class="container mx-auto divide-y divide-gray-200 max-w-7xl">
    <article>
      <header class="pt-6 xl:pb-10 space-y-1 text-center mb-6">
        <Date :date="date" />
        <h1
            class="
            text-3xl
            leading-9
            font-extrabold
            text-gray-900
            tracking-tight
            sm:text-4xl sm:leading-10
            md:text-5xl md:leading-14
          "
        >
          {{ data.title }}
        </h1>
        <h2 class="text-base font-semibold tracking-wide">
          {{ $frontmatter.subtitle }}
        </h2>
      </header>
      <div
          class="
          divide-y
          divide-gray-200
          pb-8
        "
          style="grid-template-rows: auto 1fr"
      >
        <div class="divide-y divide-gray-200">
          <Content class="prose max-w-none py-4" />
        </div>
      </div>
    </article>
    <footer
        class="
        text-sm
        font-medium
        leading-5
        flex flex-wrap justify-between
      "
    >
      <div v-if="nextPost" class="py-8">
        <h2 class="text-xs tracking-wide text-gray-500">
          Next Article
        </h2>
        <div class="link">
          <a :href="nextPost.href">{{ nextPost.title }}</a>
        </div>
      </div>
      <div v-if="prevPost" class="py-8">
        <h2 class="text-xs tracking-wide text-gray-500">
          Previous Article
        </h2>
        <div class="link">
          <a :href="prevPost.href">{{ prevPost.title }}</a>
        </div>
      </div>
      <div class="pt-8">
        <a class="link" href="/posts.html">
          <i class="fas fa-list-ul mr-2" />Back to the blog
        </a>
      </div>
    </footer>
  </div>
</template>

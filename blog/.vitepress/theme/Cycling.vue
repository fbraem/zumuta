<script setup>
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'
import { data as posts } from '../cycling.data.js'

const { frontmatter: data } = useData()

const route = useRoute()

function findCurrentIndex() {
  return posts.findIndex((p) => p.href === route.path)
}

const nextPost = computed(() => posts[findCurrentIndex() - 1])
const prevPost = computed(() => posts[findCurrentIndex() + 1])
</script>

<template>
  <article class="container mx-auto divide-y divide-gray-200 max-w-7xl py-6">
    <div
        v-if="$frontmatter.hero"
        class="mb-6"
    >
      <img :src="$frontmatter.hero" alt="" />
    </div>
    <header class="pt-6 xl:pb-10 space-y-1 text-center mb-6">
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
      <h2>Cycling</h2>
    </header>
    <div
        class="
        divide-y
        divide-gray-200
        pb-16
        xl:pb-20
      "
        style="grid-template-rows: auto 1fr"
    >
      <div class="divide-y divide-gray-200">
        <Content class="prose max-w-none pt-10 pb-8" />
      </div>

      <footer
          class="
          text-sm
          font-medium
          leading-5
          flex flex-wrap justify-between
        "
      >
        <div v-if="nextPost" class="py-8">
          <div class="link">
            <a :href="nextPost.href">{{ nextPost.title }}</a>
          </div>
        </div>
        <div v-if="prevPost" class="py-8">
          <div class="link">
            <a :href="prevPost.href">{{ prevPost.title }}</a>
          </div>
        </div>
        <div class="pt-8">
          <a class="link" href="/cycling.html"><i class="fas fa-list-ul mr-2" />Back to the overview</a>
        </div>
      </footer>
    </div>
  </article>
</template>

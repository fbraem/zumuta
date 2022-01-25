<script setup>
import { ref } from 'vue'
import Excerpt from './Excerpt.vue'
import { data as posts } from '../posts.data.js'
const recentPosts = posts.slice(0, 5);
import { useData } from "vitepress";
const data = ref(useData());
</script>

<template>
  <div class="container max-w-7xl mx-auto py-6 bg-white">
    <div
        v-if="$frontmatter.hero"
        class="mb-6"
    >
      <img :src="$frontmatter.hero" />
    </div>
    <div>
      <div class="lg:text-center">
        <h1 class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          {{ data.site.title }}
        </h1>
        <h3 class="text-base font-semibold tracking-wide">
          {{ $frontmatter.subtitle }}
        </h3>
        <p class="mt-4 max-w-2xl md:text-lg text-gray-500 lg:mx-auto text-base">
          {{ $frontmatter.description }}
        </p>
      </div>
    </div>
    <div class="py-4 sm:py-6 lg:py-8 divide-y divide-gray-200">
      <div class="lg:text-center">
        <h1 class="mb-8 text-2xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-3xl">
          My most recent hairpin turns...
        </h1>
      </div>
      <ul class="divide-y divide-gray-200">
        <li
            v-for="{ title, href, date, excerpt } of recentPosts"
            class="py-12"
        >
          <Excerpt
              :title="title"
              :href="href"
              :date="date"
              :excerpt="excerpt"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

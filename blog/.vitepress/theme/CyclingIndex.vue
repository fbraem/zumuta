<script setup>
import { data as posts } from '../cycling.data.js'
import Excerpt from "./Excerpt.vue"
</script>

<template>
  <div class="container mx-auto max-w-7xl">
    <div
        v-if="$frontmatter.hero"
        class="my-6"
    >
      <img :src="$frontmatter.hero" />
    </div>
    <div class="lg:text-center">
      <h1 class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
        {{ $frontmatter.title }}
      </h1>
      <h3 class="text-base font-semibold tracking-wide">
        {{ $frontmatter.subtitle }}
      </h3>
      <p class="mt-4 max-w-2xl md:text-lg text-gray-500 lg:mx-auto text-base">
        {{ $frontmatter.description }}
      </p>
    </div>
    <div class="divide-y divide-gray-200">
      <Content />
      <ul class="divide-y divide-gray-200">
        <li class="py-12" v-for="{ title, href, year, excerpt } of posts">
          <article class="space-y-2">
            <Excerpt
                :href="href"
                :title="title"
                :excerpt="excerpt"
            />
          </article>
        </li>
      </ul>
    </div>
  </div>
</template>

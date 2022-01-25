<template>
  <div>
    <Date
        v-if="date"
        :date="date"
    />
    <p class="text-lg leading-6 font-medium text-gray-900">
      {{ title }}
    </p>
    <p
        class="excerpt mt-2 text-base text-gray-500"
        v-html="excerpt"
    />
    <div class="mt-8">
      <a
          class="px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform rounded-md bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:yellow-600"
          :href="href"
      >
        Read more
      </a>
    </div>
  </div>
</template>

<script setup>
import Date from './Date.vue'
defineProps({
  title: {
    required: true
  },
  date: {
    type: Object,
    required: false
  },
  excerpt: {
    type: String,
    required: true
  },
  href: {
    type: String,
    required: true
  }
})
</script>

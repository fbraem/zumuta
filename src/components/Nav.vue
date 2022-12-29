<template>
  <nav class="bg-white border-gray-200 bg-yellow-500 px-2 sm:px-4 py-2.5">
    <div class="container flex flex-wrap justify-between items-center mx-auto">
      <a href="https://www.zumuta.be/" class="flex items-center">
        <div class="text-xl font-bold text-yellow-900">
          {{ title }}
          <div class="text-sm">{{ subtitle }}</div>
        </div>
      </a>
      <button
        data-collapse-toggle="navbar-default"
        type="button"
        class="inline-flex items-center p-2 ml-3 text-sm text-red-900 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
        aria-controls="navbar-default"
        aria-expanded="false"
        @click="toggle"
      >
        <span class="sr-only">Open main menu</span>
        <svg
            class="w-6 h-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill-rule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clip-rule="evenodd"
            >
            </path>
        </svg>
      </button>
      <div
        class="w-full md:block md:w-auto"
        :class="{ 'hidden': !open }"
      >
        <ul class="flex flex-col p-4 mt-4 bg-gray-50 rounded-lg border border-gray-100 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-yellow-500">
            <template v-for="link in links">
                <li>
                    <a 
                        :href="link.link"
                        class="block py-2 pr-3 pl-3 text-red-900 md:text-yellow-500 hover:text-red-900 hover:bg-yellow-500 rounded md:bg-red-900 hover:md:bg-white hover:md:text-red-900"
                        aria-current="page"
                    >
                        {{ link.name }}
                    </a>
                </li>
            </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const title = "Zumuta!"
const subtitle = "This is the way to do IT"

const links = [
  {
    name: 'Home',
    link: '/'
  },
  {
    name: 'Blog',
    link: '/posts'
  },
  {
    name: 'Cycling',
    link: '/cycling'
  },
  {
    name: 'About',
    link: '/about'
  }
]
const open = ref(false);
const toggle = () => {
  open.value = !open.value;
}
</script>
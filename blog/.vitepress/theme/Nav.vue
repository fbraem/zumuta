<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <Disclosure as="nav" class="bg-yellow-500" v-slot="{ open }">
    <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
      <div class="relative flex items-center justify-between py-3">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <!-- Mobile menu button-->
          <DisclosureButton
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-900 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          >
            <span class="sr-only">Open main menu</span>
            <i v-if="!open" class="fa fa-bars block" aria-hidden="true" />
            <i v-else class="fa fa-times block" aria-hidden="true" />
          </DisclosureButton>
        </div>
        <div class="flex-1 flex items-center justify-center sm:justify-start">
          <div class="text-red-900 text-center">
            <div class="text-xl font-bold">
              <a href="/">Zumuta!</a>
            </div>
            <div class="text-sm">That's the way to do IT</div>
          </div>
          <div class="grow hidden sm:block sm:ml-6">
            <div class="flex space-x-4 sm:justify-end">
              <a
                  v-for="item in navigation"
                  :key="item.name"
                  :href="item.href"
                  class="text-white px-3 py-2 rounded-md text-sm font-medium"
                  :class="{
                    'bg-red-900': item.current,
                    'hover:bg-gray-700': !item.current
                  }"
                  :aria-current="item.current ? 'page' : undefined"
              >
                {{ item.name }}
              </a>
            </div>
          </div>
        </div>
        <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <!-- Profile dropdown -->
          <Menu as="div" class="ml-3 relative">
            <div>
              <MenuButton class="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                <span class="sr-only">Open user menu</span>
                <img class="h-8 w-8 rounded-full" src="/me.jpg" alt="Picture of me" />
              </MenuButton>
            </div>
            <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
              <MenuItems class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                <MenuItem v-slot="{ active }">
                  <a href="https://www.twitter.com/fbraem" :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">
                    <i class="fab fa-twitter mr-2" />Twitter
                  </a>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <a href="https://www.linkedin.com/in/frankybraem/" :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">
                    <i class="fab fa-linkedin mr-2" />LinkedIn
                  </a>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <a href="https://github.com/fbraem" :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">
                    <i class="fab fa-github mr-2" />Github
                  </a>
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </div>
    </div>
    <DisclosurePanel class="sm:hidden">
      <div class="px-2 pt-2 pb-3 space-y-1">
        <DisclosureButton
            v-for="item in navigation"
            :key="item.name" as="a"
            :href="item.href"
            :class="[item.current ? 'bg-red-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'block px-3 py-2 rounded-md text-base font-medium']" :aria-current="item.current ? 'page' : undefined"
        >
          {{ item.name }}
        </DisclosureButton>
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>

<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import {useRoute} from "vitepress";
import {computed} from "vue";
const route = useRoute()

const isHome = computed(() => route.data.frontmatter.layout === 'home');
const isBlog = computed(() => route.data.frontmatter.layout === 'blog');
const isCycling = computed(() => route.data.frontmatter.layout === 'cycling');
const isAbout = computed(() =>route.data.frontmatter.title === 'About');

const navigation = [
  { name: 'Home', href: '/', current: isHome },
  { name: 'Blog', href: '/posts', current: isBlog },
  { name: 'Cycling', href: '/cycling', current: isCycling },
  { name: 'About', href: '/about', current: isAbout },
]
</script>

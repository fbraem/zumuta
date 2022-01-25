<template>
  <div class="page container mx-auto max-w-7xl py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="lg:text-center">
        <h1 class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          {{ $frontmatter.title }}
        </h1>
        <h2 class="text-base font-semibold tracking-wide">{{ $frontmatter.subtitle }}</h2>
        <p class="mt-4 max-w-2xl md:text-lg text-gray-500 lg:mx-auto text-base">
          {{ $frontmatter.description }}
        </p>
      </div>
    </div>
    <div class="divide-y divide-gray-200">
      <Content />
    </div>
  </div>
</template>

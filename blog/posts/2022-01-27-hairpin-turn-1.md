---
layout: blog
date: 2022-01-27
title: Hairpin-turn 1
tags: [hairpin-turn, vue, python, stitches, css-in-js]
editLink: true
---

v-html, python chained comparisons and stitches

---

> In a hairpin-turn article I write about things I learn along the way of heading
> to the top of IT...

### v-html

This week I encountered the following error while generating this website
with [vitepress](https://vitepress.vuejs.org/). The problem here is the use of 
the vue directive v-html.

::: danger
Hydration completed but contains mismatches.
:::

With v-html it's possible to inject HTML into an element. But you have to be
careful not to break things: v-html can break HTML. What happens when v-html
is used on a ``p`` element and the content of v-html also contains a ``p`` 
element? This will result in an invalid HTML structure: it's not allowed to 
nest ``p`` elements. The browser will ignore this silently, but Vue can
 complain with a hydration assert. To avoid this, make sure to generate
valid HTML.

````vue
<template>
  <p v-html="article" /> <!-- dangerous to break HTML standard -->
  <div v-html="article" /> <!-- this is better -->
</template>

<script setup>
const article = '<p>This is an article</p>'
</script>
````

### Python Chained Comparisons

This week IntelliJ was hinting me to simplify an if statement:

````python
if value > 0 and value < 100:
    print('value ok')
````

I let IntelliJ do the optimisation and the code turned into:

````python
if 0 < value < 100:
    print('value ok')
````

I had never seen this, and it seems to be called 
[chained comparison operators](https://docs.python.org/3/reference/expressions.html#comparisons).

Summarized:

````
x < y < z
````

is the same as:

````
x < y and y < z
````

### Stitches

I'm always up for something new (maybe a little too much because sometimes I 
start reworking things that aren't really necessary :wink:).

This week I came across [Stitches](https://stitches.dev/). Stitches is a
CSS-in-JS tool. CSS-in-JS is a styling technique where JavaScript is used to 
style components.

Currently, I'm using [TailWind CSS](https://tailwindcss.com/) for my front-end 
projects, but I'm curious if CSS-in-JS and Stitches can be a replacement for
this. When you look at components that are styled using TailWind, you will see
a lot of classes. Maybe Stitches can reduce this. I'm not going to change tack 
at the moment, but this is something to keep an eye on. I just hope to have some 
time to work on this and experiment a bit. To be continued...

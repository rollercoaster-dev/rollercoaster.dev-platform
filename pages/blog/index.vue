/// <reference types="@nuxt/content" />

<script setup lang="ts">
interface Post {
  _id: string;
  slug: string;
  title: string;
  body?: string;
}

const { data: posts } = await useAsyncData<Post[]>('posts', () => queryContent<Post>().find())
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">Blog</h1>
    <ul>
      <li v-for="post in posts" :key="post._id" class="mb-2">
        <NuxtLink :to="`/blog/${post.slug}`" class="text-blue-600 hover:underline">
          {{ post.title }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template> 
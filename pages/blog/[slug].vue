/// <reference types="@nuxt/content" />
declare module '@nuxt/content';

<script setup lang="ts">
import { useRoute, useAsyncData } from '#app'
import { queryContent } from '@nuxt/content'

interface Post {
  _id: string;
  slug: string;
  title: string;
  body: string;
}

const route = useRoute();
const slug = route.params.slug as string;

const { data: post } = await useAsyncData<Post>('post', () => queryContent<Post>(slug).findOne());
</script>

<template>
  <article class="container mx-auto p-4">
    <h1 class="text-4xl font-bold mb-4">{{ post?.title }}</h1>
    <div v-html="post?.body" class="prose"></div>
  </article>
</template> 
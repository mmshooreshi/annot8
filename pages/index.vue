<template>
  <!-- <div class="grid grid-rows-2 gap-4 m-0 bg-gray-200 h-max rounded-lg"> -->
  <div class="flex flex-col lg:flex-row gap-4 m-0 bg-gray-200 h-max rounded-lg w-full">
    <div class="lg:max-w-min">
      <VideoList @selectVideo="selectVideo" />
    </div>
    <div class="w-full" v-if="selectedVideo">
      <VideoAnnotator :selectedVideo="selectedVideo" />
    </div>
  </div>
</template>

<script setup lang="ts">
import VideoList from '@/components/VideoList.vue'
import VideoAnnotator from '@/components/VideoAnnotator.vue'
import { ref } from 'vue'

const selectedVideo = ref<{ name: string; path: string } | null>(null)

const selectVideo = (video: { name: string; path: string }) => {
  selectedVideo.value = video
}
</script>

<template>
    <div class="m-4 bg-gray-300 p-2 h-max rounded-lg">
      <h3>Video Library</h3>
      <div class="mb-4">
        <input
          v-model="searchTerm"
          placeholder="Search videos"
          class="border p-2 rounded-lg bg-black text-yellow-400 max-h-6 text-sm w-82"
        />
      </div>
      <ul class="flex-row flex gap-2 flex-wrap">
        <li
          v-for="video in filteredVideos"
          :key="video.name"
          class="mb-2 flex justify-between items-center text-nowrap text-xs"
        >
          <span class="bg-gray-400/20 hover:bg-teal-400/60 active:bg-teal-400/90 p-2 rounded-lg m-0 cursor-pointer" @click="$emit('selectVideo', video)"  >{{ video.name }}</span>
          <!-- <button @click="$emit('selectVideo', video)" class="text-blue-500">
            Open
          </button> -->
        </li>
      </ul>
    </div>
  </template>
  
  <script setup lang="ts">
  
  const videos = ref<{ name: string; path: string }[]>([])
  const searchTerm = ref('')
  
  // Fetch video files from the API
  onMounted(async () => {
    const response = await $fetch('/api/videos')
    videos.value = response as { name: string; path: string }[]
  })
  
  const filteredVideos = computed(() =>
    videos.value.filter((video) =>
      video.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  )
  </script>
  
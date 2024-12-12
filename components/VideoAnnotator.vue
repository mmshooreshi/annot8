<template>
  <div class="relative">
    <!-- Video Section with Annotations -->
    <div v-if="videoSrc"
      class="flex m-2 -mt-2 lg:m-4 lg:-ml-2 flex-col lg:flex-row items-stretch lg:space-x-6 p-6 bg-gray-50 rounded-lg shadow-md">
      <!-- Video Section -->
      <div class="flex flex-col items-center lg:items-start space-y-4 w-full lg:w-1/2">
        <div
          class="text-blue-600 border border-blue-400 bg-blue-50 rounded-lg py-1 px-3 text-xs font-medium cursor-pointer hover:bg-blue-100 transition">
          {{ videoSrc }}
        </div>
        <div class="relative w-full ">
          <div class="fixed top-16 duration-100 cursor-pointer hover:bg-black/70 max-h-56px transition-all hover:max-h-[100vh] text-wrap break-words  overflow-hidden z-200 left-[10%] right-[10%] text-white opacity-5 hover:opacity-100  backdrop-blur border-1 border-teal bg-white/20 rounded-lg p-2"> {{ labell }}</div>
          <video ref="videoPlayer" controls controlsList="nofullscreen" autoplay
            class="w-full rounded-lg shadow-lg border border-gray-200"
            :class="{ 'h-screen w-full object-contain fixed inset-0 bg-black z-50': isFullscreen }"
            @timeupdate="updateCurrentTime" @dblclick="toggleFullscreen">
            <source :src="videoSrc" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <!-- Custom Progress Bar -->
          <div class="w-full z-100 fixed left-0 bottom-6 px-4 pr-6">
            <div class="h-[0px] bg-gray-300 rounded-full relative">
              <!-- Current Progress -->
              <div class="absolute top-0 left-0 h-[0px] bg-blue-500 rounded-full" :style="{ width: `${progress}%` }"></div>
              <!-- Annotation Markers -->
              <div v-for="(annotation, index) in annotations" :key="index"
                class="group absolute -bottom-[90vh] text-center inline-block align-bottom h-[100vh] hover:bg-black/20 border-2 w-6 opacity-50 hover:opacity-100   rounded-full transform cursor-pointer backdrop-blur  hover:-mx-3 hover:w-12 hover:h-[100vh] transition-all"
                :style="{ left: `${(annotation.timestamp / videoDuration) * 100}%` }"
                @click="goToTimestamp(annotation.timestamp,annotation.label)" title="Annotation">
                <div class="group-hover:max-w-[100vw] rotate-90 mt-8 text-white">{{ annotation.label }}</div>

              </div>

            </div>
          </div>

          <!-- Annotations Overlay in Fullscreen -->
          <div v-if="isAnnotation && isFullscreen"
            class="fixed m-auto max-w-[90vw] max-h-[90vw] h-max left-[10%] lg:left-[20%] lg:right-[20%] right-[10%] top-[10%] bottom-[10%] rounded-lg bg-opacity-80 bg-black/60 backdrop-blur border-1 border-teal text-white p-4 z-200 overflow-auto">

            <button v-if="isFullscreen"
              class=" top-4 right-4 bg-red-500 text-white text-sm px-2 py-1 rounded-full hover:bg-red-600/50 text-2xs z-100"
              @click="toggleAnnotation">
              Close
            </button>


            <!-- <h3 class="text-lg font-semibold">Annotations</h3> -->
            <ul class="space-y-2 mt-2">
              <li v-for="(annotation, index) in annotations" :key="index"
                class="flex items-center justify-between bg-gray-100/20 text-black p-1 rounded-lg shadow-sm  hover:bg-white/80">
                <span @click="goToTimestamp(annotation.timestamp,annotation.label)"
                  class="cursor-pointer flex-1 text-sm text-wrap break-words overflow-auto">
                  {{ annotation.label }} ({{ formatTime(annotation.timestamp) }})
                </span>
                <div class="flex  self-start space-x-2">
                  <button class="bg-green-500 text-white text-xs py-1 px-3 rounded-md hover:bg-green-600 transition-all"
                    @click="goToTimestamp(annotation.timestamp,annotation.label)">
                    Go To
                  </button>
                  <button class="bg-red-500 text-white text-xs py-1 px-3 rounded-md hover:bg-red-600 transition-all"
                    @click="deleteAnnotation(index)">
                    Delete
                  </button>
                </div>
              </li>
            </ul>


            <div class="mt-6 flex flex-col space-y-4">
              <!-- <label for="newAnnotation" class="text-sm font-medium text-gray-700">Add a New Annotation</label> -->
              <textarea v-model="newAnnotation" id="newAnnotation" rows="4"
                class="w-full text-black border bg-white/20 border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your annotation here"></textarea>
              <button @click="addAnnotation"
                class="bg-blue-500 text-white text-sm py-2 rounded-lg hover:bg-blue-600 transition-all">
                Add Annotation
              </button>
            </div>

          </div>

          <button v-if="!isAnnotation"
            class="fixed top-4 right-24 bg-teal-500 text-white text-sm px-4 py-2 rounded-full hover:bg-teal-600 z-100"
            @click="toggleAnnotation">
            Annotation
          </button>

          <button v-if="isFullscreen"
            class="fixed top-4 right-4 bg-red-500 text-white text-sm px-4 py-2 rounded-full hover:bg-red-600 z-100"
            @click="toggleFullscreen">
            Close
          </button>
        </div>
      </div>

      <!-- Annotations Section -->
      <div class="flex flex-col w-full lg:w-1/2 bg-white p-4 rounded-lg shadow-md">
        <h3 class="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Annotations</h3>
        <ul class="space-y-4">
          <li v-for="(annotation, index) in annotations" :key="index"
            class="flex items-center justify-between bg-gray-100 p-3 rounded-lg shadow-sm">
            <span @click="goToTimestamp(annotation.timestamp,annotation.label)"
              class="flex-1 text-sm text-gray-800 text-wrap break-words overflow-auto cursor-pointer">
              {{ annotation.label }} ({{ formatTime(annotation.timestamp) }})
            </span>
            <div class="flex space-x-2">
              <button class="bg-green-500 text-white text-xs py-1 px-3 rounded-md hover:bg-green-600 transition-all"
                @click="goToTimestamp(annotation.timestamp,annotation.label)">
                Go To
              </button>
              <button class="bg-red-500 text-white text-xs py-1 px-3 rounded-md hover:bg-red-600 transition-all"
                @click="deleteAnnotation(index)">
                Delete
              </button>
            </div>
          </li>
        </ul>

        <div class="mt-6 flex flex-col space-y-4">
          <label for="newAnnotation" class="text-sm font-medium text-gray-700">Add a New Annotation</label>
          <textarea v-model="newAnnotation" id="newAnnotation" rows="4"
            class="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your annotation here"></textarea>
          <button @click="addAnnotation"
            class="bg-blue-500 text-white text-sm py-2 rounded-lg hover:bg-blue-600 transition-all">
            Add Annotation
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  selectedVideo: {
    type: Object as () => { name: string; path: string } | null,
    required: true
  }
})

const annotations = ref<{ label: string; timestamp: number }[]>([])
const newAnnotation = ref('')
const currentTime = ref(0)
const isFullscreen = ref(false)
const isAnnotation = ref(true)
const videoPlayer = ref<HTMLVideoElement | null>(null)
const progress = ref(0)
const videoDuration = ref(0)
const labell= ref("")

const updateCurrentTime = () => {
  if (videoPlayer.value) {
    currentTime.value = videoPlayer.value.currentTime
    progress.value = (currentTime.value / videoDuration.value) * 100
  }
}

const syncProgressBar = () => {
  if (videoPlayer.value) {
    progress.value = (videoPlayer.value.currentTime / videoPlayer.value.duration) * 100
  }
}


const addAnnotation = () => {
  if (newAnnotation.value.trim()) {
    annotations.value.push({
      label: newAnnotation.value,
      timestamp: currentTime.value
    })
    newAnnotation.value = ''
  }
  saveAnnotations()
}

const deleteAnnotation = (index: number) => {
  annotations.value.splice(index, 1)
  saveAnnotations()
}

const goToTimestamp = (timestamp: number, label: string) => {
  if (videoPlayer.value) {
    videoPlayer.value.currentTime = timestamp
    videoPlayer.value.play()
  }

  labell.value = label
}

const saveAnnotations = async () => {
  if (!props.selectedVideo) return
  const response = await $fetch('/api/annotations', {
    method: 'POST',
    body: {
      [props.selectedVideo.path]: annotations.value
    }
  })
  console.log(response)
  if (response.success) {
    // alert('Annotations saved successfully!')
  }
}

const fetchAnnotations = async () => {
  if (!props.selectedVideo) return
  const response = await $fetch('/api/annotations')
  annotations.value = response[props.selectedVideo.path] || []
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}

const toggleFullscreen = (event: MouseEvent) => {
  event.preventDefault()
  isFullscreen.value = !isFullscreen.value
  isAnnotation.value = true
}

const toggleAnnotation = (event: MouseEvent) => {
  event.preventDefault()
  isAnnotation.value = !isAnnotation.value

}

fetchAnnotations()

// Watch for changes in selectedVideo and fetch annotations
watch(
  () => props.selectedVideo?.path, // Watch the video path directly
  (newPath: string | null) => {
    if (newPath && videoPlayer.value) {
      console.log('Video source changed:', newPath)

      // Pause the current video and reset its source
      videoPlayer.value.pause()
      videoPlayer.value.load() // Reload the video element

      // Fetch the new annotations
      fetchAnnotations()
    }
  },
  { immediate: true }
)
const videoSrc = computed(() => props.selectedVideo?.path)

onMounted(() => {
  if (videoPlayer.value) {
    videoPlayer.value.onloadedmetadata = () => {
      videoDuration.value = videoPlayer.value?.duration || 0
    }
  }
})

</script>

<style scoped>
/* Additional styles for fullscreen behavior */
</style>

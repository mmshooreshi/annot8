// import { ref, Ref } from 'vue'
// import { defineStore } from 'pinia'

// interface CounterState {
//   n: number
//   myRef: Ref<string>
// }

// export const useCounter = defineStore('counter', {
//   state: (): CounterState => ({
//     n: 5,
//     myRef: ref('hello')
//   }),
//   actions: {
//     increment() {
//       this.n++
//     }
//   }
// })



import { defineStore } from 'pinia'

export const useMetadataStore = defineStore('metadata', {
  state: () => ({
    labels: [] as { id: number; text: string }[]
  }),
  actions: {
    addLabel(label: string) {
      this.labels.push({ id: Date.now(), text: label })
    },
    removeLabel(id: number) {
      this.labels = this.labels.filter((label) => label.id !== id)
    }
  }
})


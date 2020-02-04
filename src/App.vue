<template>
  <div id="app" class="bg-gray-100 min-h-screen p-4 font-sans">
    <h1 class="pt-4 mb-8 text-3xl font-semibold text-gray-900">Color Converter</h1>
    <div class="max-w-xs">
      <div class="flex items-center mb-4">
        <input type="text" class="border-2 text-base h-10 px-2 flex-1 border-gray-300 focus:border-indigo-500 focus:outline-none rounded" v-model="color" placeholder="#ff0066" />
        <div class="w-10 h-10 rounded ml-2 flex-shrink-0 shadow-inner" :style="swatchColor"></div>
      </div>
      <div class="flex justify-end pr-12">
        <button class="px-4 py-2 rounded border-2 border-transparent text-base text-indigo-500 bg-transparent hover:bg-indigo-100 focus:border-indigo-400 focus:outline-none mr-2" @click="resetForm">Reset</button>
        <button class="px-4 py-2 rounded text-base text-white bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 focus:outline-none" @click="onSubmit">Convert</button>
      </div>
    </div>

    <div
      v-if="isValid"
      class="mt-6 max-w-sm text-lg">
      <div v-for="(c, i) in converted" :key="i" class="mb-3">
        <span class="text-black inline-block text-right mr-2">{{ c.format }}:</span>{{ c.value }}
      </div>
    </div>
    <div v-else-if="showInvalid" class="mt-6 max-w-sm">
      <p class="text-red-600">Please input a valid color.</p>
    </div>
  </div>
</template>

<script>
import converter from '@/lib/converter'

export default {
  name: 'App',
  data() {
    return {
      color: '',
      converted: null,
      showInvalid: false
    }
  },
  computed: {
    isValid() {
      return converter.isValidColor(this.color)
    },
    swatchColor() {
      if (!this.isValid) {
        return 'background-color: transparent'
      } else {
        return `background-color: ${this.color}`
      }
    }
  },
  methods: {
    onSubmit() {
      this.showInvalid = !this.isValid

      if (this.isValid === true) {
        const outputFormats = converter.getConversionOptionsFromColor(this.color)
        this.converted = outputFormats.map(format => {
          let val = converter.convertColor(this.color, format.value)
          return {
            format: format.label,
            value: val
          }
        })
      }
    },
    resetForm() {
      this.converted = null
      this.color = ''
      this.showInvalid = false
    }
  }
}
</script>

<style>
@import './assets/main.css';
</style>
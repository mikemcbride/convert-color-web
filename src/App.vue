<template>
  <div id="app" class="bg-gray-100 min-h-screen p-4">
    <h1 class="pt-4 mb-8 text-3xl font-semibold text-gray-900">Color Converter</h1>
    <el-form @submit.native.prevent status-icon class="max-w-sm" ref="form" :rules="rules" :model="form" label-width="120px">
      <el-form-item label="Color" prop="color">
        <div class="flex items-center">
          <el-input v-model="form.color" placeholder="#ff0066"></el-input>
          <div class="w-8 h-8 rounded ml-2 flex-shrink-0 shadow-inner" :style="`background-color: ${form.color}`"></div>
        </div>
      </el-form-item>
      <el-form-item class="pt-2">
        <el-button @click="resetForm">Reset</el-button>
      </el-form-item>
    </el-form>

    <div
      v-if="isValid"
      class="mt-6 max-w-sm">
      <div v-for="(c, i) in converted" :key="i" class="mb-3">
        <span class="text-black inline-block text-right w-20 mr-2">{{ c.format }}:</span>{{ c.value }}
      </div>
    </div>
  </div>
</template>

<script>
import converter from '@/lib/converter'

export default {
  name: 'App',
  data() {
    return {
      isValid: false,
      form: {
        color: ''
      },
      rules: {
        color: {
          validator: (rule, value, callback) => {
            if (!converter.isValidColor(value)) {
              this.outputFormats = []
              this.converted = null
              this.isValid = false
              callback(new Error('Please input a valid color'))
            } else {
              const outputFormats = converter.getConversionOptionsFromColor(value)
              this.converted = outputFormats.map(format => {
                let val = converter.convertColor(value, format.value)
                return {
                  format: format.label,
                  value: val
                }
              })
              this.isValid = true
              callback()
            }
          },
          trigger: 'change'
        }
      },
      converted: null,
      outputFormats: []
    }
  },
  methods: {
    resetForm() {
      this.converted = null
      this.outputFormats = []
      this.$refs.form.resetFields()
    }
  },
}
</script>

<style>
@import './assets/main.css';
</style>
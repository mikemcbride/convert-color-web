<template>
  <div id="app">
    <label for="color">Color</label>
    <input type="text" v-model="color" placeholder="Input color" />
    <button @click="convertColor">Convert</button>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
@import './assets/main.css';
</style>
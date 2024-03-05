<template>
  <div id="app">
    <h3 @click="sendRequest('get')">发送GET请求</h3>
    <h3 @click="sendRequest('post')">发送POST请求</h3>
    <h3 @click="sendRequest('delete')">发送DELETE请求</h3>
    <h3 @click="sendRequest('put')">发送PUT请求</h3>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import request from './https/index'

const sendRequest = (type: string) => {
  const typeMap: any = {
    get: sendGet,
    post: sendPost,
    delete: sendDelete,
    put: sendPut
  }

  typeMap[type]()
}

const sendGet = async () => {
  await request.get('/api/hello')
}

const sendPost = async () => {
  await request.post('/api/data', {data: '111111'})
}

const sendDelete = async () => {
  await request.delete(`/api/data/:${11}`)
}

const sendPut = async () => {
  await request.put(`/api/data/:${22}`)
}

</script>

<style scoped lang="scss"></style>

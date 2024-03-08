<template>
  <div id="app">
    <ul>
      <h5>接口列表：</h5>
      <li>get: /api/hello</li>
      <li>post: /api/data</li>
      <li>delete: /api/data/:11</li>
      <li>put: /api/data/:11</li>
    </ul>
    <h3>自定义拦截测试</h3>
    <div class="btn-box">
      <span @click="testCustomActions('all-request')">全部请求拦截</span>
      <span @click="testCustomActions('scope-request')">部分请求拦截</span>
      <span @click="testCustomActions('all-response')">全部响应拦截</span>
      <span @click="testCustomActions('scope-response')">部分响应拦截</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import allRequest from './https/customFactory/allRequest'

const testCustomActions = (type: string) => {
  const typeMap: any = {
    'all-request': useAllRequest,
    'scope-request': useScopeRequest,
    'all-response': useAllResponse,
    'scope-response': useScopeResponse
  }

  typeMap[type]()
}

const useAllRequest = async () => {
  await allRequest.get('/api/hello?code=1111')
  await allRequest.post('/api/data', { data: '111111' })
  await allRequest.delete(`/api/data/:${11}`)
  await allRequest.put(`/api/data/:${22}`)
}

const useScopeRequest = async () => {
  // await request.post('/api/data', { data: '111111' })
}

const useAllResponse = async () => {
  // await request.delete(`/api/data/:${11}`)
}

const useScopeResponse = async () => {
  // await request.put(`/api/data/:${22}`)
}

</script>

<style>
.btn-box {
  display: flex;
  align-items: center;
}

.btn-box span {
  padding: 5px;
  margin-right: 5px;
  background-color: black;
  color: #ffffff;
  border-radius: 5px;
  font-size: 12px;
  cursor: pointer;
}
</style>

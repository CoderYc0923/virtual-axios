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
import allRequest from "./https/customFactory/allRequest";
import scopeRequest from "./https/customFactory/scopeRequest";
import allResponse from "./https/customFactory/allResponse";
import scopeResponse from "./https/customFactory/scopeResponse";

const testCustomActions = (type: string) => {
  const typeMap: any = {
    "all-request": useAllRequest,
    "scope-request": useScopeRequest,
    "all-response": useAllResponse,
    "scope-response": useScopeResponse,
  };

  typeMap[type]();
};

const useAllRequest = async () => {
  await allRequest.get("/api/hello?code=1111");
  await allRequest.post("/api/data", { data: "111111" });
  await allRequest.delete(`/api/data/:${11}`);
  await allRequest.put(`/api/data/:${22}`);
};

const useScopeRequest = async () => {
  await scopeRequest.get("/api/hello?code=1111");
  await scopeRequest.post("/api/data", { data: "111111" });
  await scopeRequest.delete(`/api/data/:${11}`);
  await scopeRequest.put(`/api/data/:${22}`);
};

const useAllResponse = async () => {
  await allResponse.get("/api/hello?code=1111");
  await allResponse.post("/api/data", { data: "111111" });
  await allResponse.delete(`/api/data/:${11}`);
  await allResponse.put(`/api/data/:${22}`);
};

const useScopeResponse = async () => {
  await scopeResponse.get("/api/hello?code=1111");
  await scopeResponse.post("/api/data", { data: "111111" });
  await scopeResponse.delete(`/api/data/:${11}`);
  await scopeResponse.put(`/api/data/:${22}`);
};
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

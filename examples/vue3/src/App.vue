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
    <h3>工厂内部功能测试</h3>
    <div class="btn-box">
      <span @click="testInternalFunctions('cancel-repeat')">重复请求(低速3G下测试效果更佳)</span>
      <span @click="testInternalFunctions('retry')">重试</span>
      <span @click="testInternalFunctions('pollings')">轮询</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

//自定义拦截
import allRequest from "./https/customFactory/allRequest";
import scopeRequest from "./https/customFactory/scopeRequest";
import allResponse from "./https/customFactory/allResponse";
import scopeResponse from "./https/customFactory/scopeResponse";

//内部功能
import cancelRepeat from "./https/internalFactory/cancelRepeat";
import retryAxios from "./https/internalFactory/retry";
import pollingAxios from "./https/internalFactory/polling";


const testCustomActions = (type: string) => {
  const typeMap: any = {
    "all-request": useAllRequest,
    "scope-request": useScopeRequest,
    "all-response": useAllResponse,
    "scope-response": useScopeResponse,
  };

  typeMap[type]();
};

//全部请求拦截 test ok
const useAllRequest = async () => {
  await allRequest.get("/api/hello?code=1111");
  await allRequest.post("/api/data", { data: "111111" });
  await allRequest.delete(`/api/data/:${11}`);
  await allRequest.put(`/api/data/:${22}`);
};

//部分请求拦截 test ok
const useScopeRequest = async () => {
  await scopeRequest.get("/api/hello?code=1111");
  await scopeRequest.post("/api/data", { data: "111111" });
  await scopeRequest.delete(`/api/data/:${11}`);
  await scopeRequest.put(`/api/data/:${22}`);
};

//全部响应拦截 test ok
const useAllResponse = async () => {
  await allResponse.get("/api/hello?code=1111");
  await allResponse.post("/api/data", { data: "111111" });
  await allResponse.delete(`/api/data/:${11}`);
  await allResponse.put(`/api/data/:${22}`);
};

//部分响应拦截 test ok
const useScopeResponse = async () => {
  await scopeResponse.get("/api/hello?code=1111");
  await scopeResponse.post("/api/data", { data: "111111" });
  await scopeResponse.delete(`/api/data/:${11}`);
  await scopeResponse.put(`/api/data/:${22}`);
};

const testInternalFunctions = (type: string) => {
  const typeMap: any = {
    "retry": useRetry,
    "cancel-repeat": useCancelRepeat,
    "pollings": usePollings,
  };

  typeMap[type]();
};

//重试 test ok
const useRetry = async () => {
  retryAxios.get("/api/hello/error");
  //retryAxios.post("/api/data/error", { data: "111111" });
  //retryAxios.delete(`/api/data/error/:${11}`);
  //retryAxios.put(`/api/data/error/:${22}`);
}

//重复请求 test ok
const useCancelRepeat = async () => {
  cancelRepeat.get("/api/hello?code=1111");
  cancelRepeat.post("/api/data", { data: "111111" });
  cancelRepeat.delete(`/api/data/:${11}`);
  cancelRepeat.put(`/api/data/:${22}`);

  cancelRepeat.get("/api/hello?code=1111");
  cancelRepeat.post("/api/data", { data: "111111" });
  cancelRepeat.delete(`/api/data/:${11}`);
  cancelRepeat.put(`/api/data/:${22}`);

  cancelRepeat.get("/api/hello?code=1111");
  cancelRepeat.post("/api/data", { data: "111111" });
  cancelRepeat.delete(`/api/data/:${11}`);
  cancelRepeat.put(`/api/data/:${22}`);
}

//轮询 test ok
const usePollings = async () => {
  pollingAxios.get("/api/hello?code=1111");
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

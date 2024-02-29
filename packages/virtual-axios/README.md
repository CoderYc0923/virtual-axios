# virtual-axios

丰富你的axios

## 快速开始

```js
//安装
npm i virtual-watcher -S
//or pnpm yarn

//使用
import { initVirtualWatcher,UserInfo,InitConfig, } from 'virtual-watcher'

var networkInfo:UserInfo;
const onUpdate = (info: UserInfo) => {
  console.log("onUpdate", info);
  networkInfo.value = info;
};
const getNetworkInfo = () => {
  const initConfig: InitConfig = {
    onUpdate,
    updateTime: 2000,
  };
  initVirtualWatcher(initConfig);
};
getNetworkInfo()
```

:::tip
若要测试，可以打开控制台 Network 标签中切换不同网速查看效果
:::

## 属性和方法

| 属性和方法         | 描述                                                                                              |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| initVirtualWatcher | 初始化监听器，需传入 initConfig 初始化参数                                                        |
| initConfig         | 初始化参数，必填：onUpdate - 网络变化监听回调函数 可选：updateTime - 监听频率，默认 1000，即 1 秒 |

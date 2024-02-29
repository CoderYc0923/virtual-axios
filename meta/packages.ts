export const packages: any[] = [
  // {
  //   name: 'demo',
  //   display: 'Demo', // 展示名
  //   description: 'demo: 项目简介',
  //   keywords: ['关键词1', '关键词2'],
  //   external: ['vue', 'vue-router', 'dayjs'], // 外部依赖
  //   build: false, // 是否打包
  //   iife: false, // 是否打包 iife 格式
  //   cjs: false, // 是否打包 cjs 格式
  //   mjs: false, // 是否打包 mjs/es 格式
  //   dts: false, // 是否打包 ts声明
  //   target: 'es2015', // 打包的兼容性
  //   moduleJs: true, // 是否 main 入口指向 index.mjs
  //   utils: true // 含义：1.不会在文档中看到此分类 2.此分类只会参与打包到npm以及让库内其他包使用
  //   globals: {
  //     // 用到的全局变量名，用于打包
  //     dayjs: 'Dayjs',
  //     'vue-router': 'VueRouter',
  //     'js-cookie': 'JsCookie',
  //     easyqrcodejs: 'Easyqrcodejs'
  //   }
  // },
  {
    name: "virtual-axios",
    display: "Vue3",
    external: [],
    moduleJs: true, // 是否 main 入口指向 index.mjs
    target: 'es2015', // 打包的兼容性
    mjs: true, // 是否打包 mjs/es 格式
    dts: true,
    description:
      "axios加工，丰富你的axios",
    keywords: [
      "axios",
      "请求封装",
      "请求拦截",
      "取消重复请求"
    ],
    exampleName: "vue3",
    exampleGitHubPath: ""
  },
];

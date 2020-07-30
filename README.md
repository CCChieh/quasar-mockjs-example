# Quasar 使用 Mock.js

![image-20200730153254415](https://raw.githubusercontent.com/CCChieh/image/master/20200730153254.png)

## 前言

之前我开发VUE的时候都是使用Element-UI，在Element-UI下有许多优秀的项目，比如著名的[vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)。

![hero](https://raw.githubusercontent.com/CCChieh/image/master/20200730163908.png)

不过Element-UI最近似乎很少维护了，在被网友安利了Quasar后看来其官方文档https://quasar.dev/（中文：http://www.quasarchs.com/）后感觉功能挺多的，架构设计等个人感觉挺优美的，于是计划下一个项目切到Quasar，但是Quasar缺乏一个像vue-element-admin的项目，所以有些东西就得自己动手。其中vue-element-admin的Mock Data[新方案](https://panjiachen.github.io/vue-element-admin-site/zh/guide/essentials/mock-api.html#新方案)`mock-server`，十分的好用，于是像移植过来，至于为什么不直接使用Mockjs呢，vue-element-admin已经讲的很清楚了：

> 由于 [vue-element-admin](https://github.com/PanJiaChen/vue-element-admin) 是一个纯前端个人项目，所有的数据都是用 [mockjs](https://github.com/nuysoft/Mock) 模拟生成。它的原理是: 拦截了所有的请求并代理到本地，然后进行数据模拟，所以你会发现 `network` 中没有发出任何的请求。
>
> 但它的最大的问题是就是它的实现机制。它会重写浏览器的`XMLHttpRequest`对象，从而才能拦截所有请求，代理到本地。大部分情况下用起来还是蛮方便的，但就因为它重写了`XMLHttpRequest`对象，所以比如`progress`方法，或者一些底层依赖`XMLHttpRequest`的库都会和它发生不兼容，可以看一下我项目的[issues](https://github.com/PanJiaChen/vue-element-admin/issues?utf8=✓&q=mock)，就知道多少人被坑了。
>
> 它还有一个问题是，因为是它本地模拟的数据，实际上不会走任何网络请求。所以本地调试起来很蛋疼，只能通过`console.log`来调试。就拿`vue-element-admin`来说，想搞清楚 `getInfo()`接口返回了什么数据，只能通过看源码或者手动 `Debug` 才能知道。

在讲`mock-server`移植过来的时候遇见了挺多坑的，于是写下来做个记录。

## vue-element-admin中的mock-server

先来看看再vue-element-admin是如何使用`mock-server`的。

从官方文档中可知在`vue.config.js`文件中大概[39行](https://github.com/PanJiaChen/vue-element-admin/blob/5e7113935cf9b0ba69867ae569cccda95b687118/vue.config.js#L39)

```javascript
   before: require('./mock/mock-server.js')
```

这里通过`webpack-dev-serve`导入了`mock-server`

而本地的Mockjs服务在[main.js](https://github.com/PanJiaChen/vue-element-admin/blob/5e7113935cf9b0ba69867ae569cccda95b687118/src/main.js#L31-L34)中

```javascript
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}
```



通过判断环境来进行切换。

整个mock的文件都在`./mock`目录下。到这里可以发现整个`mock-server`和项目的耦合度是十分的低的，移植难度应该不大。

## 将mock-server移植到Quasar

新建Quasar项目的时候我是使用Quasar CLI创建的，至于使用Vue CLI的同学把上面提到的原样复制过去就可以。

首先把vue-element-admin的mock目录下的文件复制到你的项目中。

先来看看`vue.config.js`，在Quasar CLI中是没有这个配置文件的，取而代之的是quasar.conf.js文件，在这里面一样是有devServer的，直接加入

```javascript
    devServer: {
      https: false,
      port: 9557,
      open: true, // opens browser window automatically
      before: require('./mock/mock-server.js')
    },
```

然后我们去找下main.js文件,似乎Quasar没有这个文件，查阅文档发现https://quasar.dev/quasar-cli/boot-files原来Quasar把main.js剥离成boot文件了，那么好吧，我们在`./src/boot`目录下新建一个mock.js文件：

```javascript
export default async (/* { app, router, Vue ... } */) => {
  if (process.env.NODE_ENV === 'production') {
    const { mockXHR } = require('../../mock')
    mockXHR()
  }
}
```

回到quasar.conf.js中把mock加入启动项：

```javascript
module.exports = function (ctx) {
  return {
    boot: [
      'mock'
    ],
```

理论上至此应该成功了才对，但是每次都是404.。。。。。

这个问题排查了大半天，最后定位到[mock-server.js](https://github.com/PanJiaChen/vue-element-admin/blob/5e7113935cf9b0ba69867ae569cccda95b687118/mock/mock-server.js#L37)文件内获取环境变量不能正常获取，通过官方的conf配置环境变量后也无法获得，使用了两个官方插件 [@quasar/dotenv](https://github.com/quasarframework/app-extension-dotenv) or [@quasar/qenv](https://github.com/quasarframework/app-extension-qenv)，@quasar/dotenv可以在mock-server.js中获取到变量，但是我在设置axios的时候又无法获取到变量，而@quasar/qenv却相反，这里可能是因为一个环境是开发编译的的一个浏览器的，两者环境变量独立分开（这里只是猜测，还希望有大佬具体讲解下）。



当然比较粗暴的方法是直接把process.env.VUE_APP_BASE_API改成你要mock的路径。。当然这种方法太不优雅了，最终决定使用cross-env直接在package.json里面设置环境变量,在scripts里面添加:

```json
    "dev": "cross-env BASE_API=/api quasar dev",
    "dev:remote": "cross-env BASE_API=http://localhost:8080/api quasar dev",
```

分别为不同的mock服务器默认dev是使用mock-server。

直接设置似乎axios里面又不能获取，最后打印发现，本地的环境变量还传不到。。。。。

最后还需要再quasar.conf.js中添加设置

```javascript
      env: {
        BASE_API: process.env.BASE_API
      },
```

再mock-server.js和axios中也都使用该变量。

移植好的项目在https://github.com/CCChieh/quasar-mockjs-example

# 相关资料

[vue-element-admin](https://panjiachen.github.io/vue-element-admin-site/zh/)

[Quasar](https://quasar.dev/start)
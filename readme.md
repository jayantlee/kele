### kele-webpack-template

基于 webpack4 的移动端 WebApp 配置模版。

### 代码规范格式化(eslint + prettier)

1. 使用 vscode 中 eslint 插件辅助检查
2. 利用 git hooks 做 commit 时 eslint 检查

### 优化打包速度

1. 升级 nodejs，npm 以及 webpack 的版本(npm 可以更快帮助我们查找包的依赖项)
2. 缩小 loaders 的作用范围
3. 尽可能少的使用 plugin
4. resolve 参数合理配置
5. 使用 DllPlugin 提高打包速度
6. 控制包的大小
7. 多进程打包(thread-loader, parallel-webpack, happypack)
8. 合理使用 sourceMap
9. 结合 stat 分析打包结果

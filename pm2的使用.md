# 安装  https://pm2.keymetrics.io/
```
npm i pm2 -g
```
## 常用命令
- 简单的启动项目 这样启动项目可以在启动之后关掉终端
```
pm2 start app.js -> node app.js
```
- 启动项目的时候命名一个应用
```
pm2 start app.js --name 名字
```
- 启动项目并监听文件的变更（自动重启）
```
pm2 start app.js --watch  --name 名字
```
- 关闭应用
```
pm2 stop 应用名或者应用编号
pm2 stop all 关闭全部的应用
```
- 查询pm2正在维护的node应用
```
pm2 list
```
- 查看  node应用的console输出
```
pm2 logs
```


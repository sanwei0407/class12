const express = require('express') // 引入express

const app = express(); //  创建一个express实例
const router = express.Router() // 创建一个Router实例
const UserRouter = require('./user')

// express 当中使用自带的json方法和urlencoded方法来解析body内容
app.use(express.urlencoded({ extended: false })) // urlencoded
app.use(express.json()) // json 



// 无论是全局还是局部中间件 先后顺序都是按照在代码当中的书写顺序执行

// app.use( (req,res,next)=>{  
//     console.log('1 fired')
//     next();
//     console.log('1 end')
//  }, (req,res,next)=>{  
//     console.log('2 fired')
//     next();
//     console.log('2 end')
//  }, ( req,res,next )=>{ 
//     console.log('3 fired')
// })


// app.use((req,res,next)=>{
//     console.log('req',req.a,req.b)
//     console.log('1 fired')
//     req.a = 1;
//     req.b = 2; 
//     req.kfc = ()=>{
//       console.log('其实我是想去金拱门')
//     }
//     next()
// })


// app.use((req,res,next)=>{
//     console.log('2 fired')
//     console.log('req in the sencond mw',req.a,req.b)
//     req.kfc();
// })


// app.get('/a',(req,res,next)=>{
//     console.log('/a fired by get')
// })

// app.post('/a',(req,res,next)=>{
//     console.log('/a fired by post')
// })



app.use((req,res,next)=>{
  // console.log(req.ip) // req.ip 获取请求的客户端的ip地址
  // console.log('query',req.query)
  // console.log('headers',req.headers)
  // console.log('body',req.body)
  // console.log('hostname',req.hostname)
  next()

  // res.send('ok')
  // res.json({a:1,b:2})
  // res.status(300).end();
  // res.status(300).send('ok123123213')


})



app.use('/user',UserRouter);








//  让 应用运行在3000端口
app.listen(3000,()=>{
  console.log('app is running at 3000');
})
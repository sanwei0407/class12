const express = require('express') // 引入express
const nunjucks  = require('nunjucks');
const path = require('path');

const app = express(); //  创建一个express实例

const cors = require('cors') // npm i cors --save
app.use(cors()) // 解除跨域限制

const jwt = require('jsonwebtoken');
app.use((req,res,next)=>{
    req.sign = (res)=>{
      return  jwt.sign(res,'123456')
    }
    next();
})

// 黑名单机制  指定要检测url
/*
app.use((req,res,next)=>{
  const { url } = req;
  const blackList = [
    '/user/update'
 ]
  if(blackList.includes(url)){
     try { 
          const tk = req.headers.authorization;
          const decode = jwt.verify(tk,'123456');
          req.decode = decode;
          return next();
      } catch(e) {
         res.status(401).end();
        
     }
  }
       
  next()
})
*/

// 白名单机制  指定的url 可以免鉴权

app.use((req,res,next)=>{
  const whiteList = [
    '/user/login'
  ]
  const { url} = req;
  if(whiteList.includes(url)) return next();

   try { 
          const tk = req.headers.authorization;
          const decode = jwt.verify(tk,'123456');
          req.decode = decode;
          return next();
      } catch(e) {
          res.status(401).end();
        
   }

})

// 建立与数据库的操作

const db = require('./db')

// 如果需要在req当中读取cookies 就需要安装 cookie-parser  npm  i cookie-parse --save
const cookieParser = require('cookie-parser')
app.use(cookieParser()) // 使用cookie解析器

// 安装cookie-session  npm i cookie-session 
const cookieSession = require('cookie-session');
app.use(cookieSession({
    name:'session', // 保存到客户端的cookie的name
    secret:'123456', // 加密密匙
    maxAge: 24*60*60*1000, // 过期时长
}))


// 设置静态文件
// 指定一个 assets目录放置静态文件
// app.use(expres.static('assets')) // 访问从根开始 xxxx:3000/index.css
app.use('/abc',express.static('assets')); //从 xxx:3000/abc/index.css


// 设置模板引擎
app.set('view engine','njk'); 
// 设置模板放置的目录 __dirname 是node提供的一个全局变量  表示当前文件所谓目录
app.set('views',path.resolve(__dirname,'./views'));

// 对于nunjuck进行配置
nunjucks.configure('views',{autoescape:true,express:app});

const router = express.Router() // 创建一个Router实例
const UserRouter = require('./user');
const req = require('express/lib/request');

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

app.get('/tt',(req,res)=>{
      const _d = new Date();
      _d.setSeconds(_d.getSeconds()+60)
      res.cookie('abc',456,{
        expires: _d, // 约定cookie到期时间
        path: '/abc', // 约定cookie的课访问路径
        httpOnly: true,
         // httpOnly 是否值允许请求的时候对cookie进行操作 不允许js去操作这个cookie
      })
      res.send('ok')
})


app.use('/ttread',(req,res)=>{
  console.log(req.cookies);
  res.end()
})

app.get('/abc',(req,res)=>{
    res.send('abc')
})

app.get('/ss',(req,res)=>{

  // req.session.view = 1; // 设置一个session的值
  req.session.view =  (req.session.view || 0 ) + 1
  res.send('ok 您过去的24小时内访问的次数为'+req.session.view)
})

app.get('/ssread',(req,res)=>{
  // 通过req.session 也可以读取session
  console.log('session',req.session)
   res.send('ok')
})


app.get('/login',(req,res)=>{

  req.session.username = 'dixon'
  res.send('login ok')
})

app.get('/other',(req,res)=>{

  if(!req.session.username) return res.send('请先登录')
  res.send('欢迎'+req.session.username+'回来')
})



app.post('/genToken',(req,res)=>{
  const tk = jwt.sign({cunkuan:5000000000},'123456')
  res.send(tk)  
  
})
app.post('/decodeToken',(req,res)=>{
  const tk = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdW5rdWFuIjo1MDAwMDAwMDAwLCJpYXQiOjE2NDU3NTM5MzN9.4kb9cM4pDBe6_WnMFlaER6hn6Ajd8txNh5ycJyeL1xg'
  const decodeStr = jwt.verify(tk,'12345')
  res.send(decodeStr)
})


//  让 应用运行在3000端口
app.listen(3000,()=>{
  console.log('app is running at 3000');
})
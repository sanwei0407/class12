const express = require('express') // 引入express
const nunjucks  = require('nunjucks');
const path = require('path');
//  socket引入第一步 引入node自带的http模块的createServer 
const { createServer } = require("http");
//  socket引入第二步 通过socket.io引入 Server方法创建socket服务 
const { Server } = require("socket.io");

const app = express(); //  创建一个express实例

// socket引入第三部  使用原生http模块来驱动web服务
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });  // 创建io实例


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
    '/user/login',
    '/user/op'
  ]
  const { url} = req;
  return next();
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


app.post('/testSc',(req,res)=>{

  io.emit('abcdefg',999)
  res.send('这个是ajax的返回的信息')
})


//  让 应用运行在3000端口 
// app.listen(3000,()=>{
//   console.log('app is running at 3000');
// })

io.on('connect',(socket)=>{
  // console.log('socket',socket)
  // 服务端的socket对象重要关注以下一个内容
  // 得到当前与我链接的socket客户id
  // console.log('id',socket.id)
  // sockets得到当前与socket服务器建立链接的全部socket客户 这个sockets是一个MAP对象
  
  // console.log('sockets',socket.nsp.sockets)

  // 对于sockets 可以使用 forEach来遍历这个map对象拿出对应的信息（query的参数以及socketid）
  // socket.nsp.sockets.forEach(item=>{
  //   console.log('item',item.id)
  //   console.log('handshake',item.handshake.query)
  // })

  // 链接的时候传递的参数
  // console.log('handshake',socket.handshake)

  // 通过socket.on(事件名,函数(客户端传递过来的参数))接受客户端的请求
  socket.on('newmsg',res=>{
    console.log('有人发消息过来了',res)
    
    //  io.emit(事件名,传递参数) 全体广播
    // io.emit('newmsg',{
    //   from: socket.handshake.query.uname,
    //   time: new Date(),
    //   ct: res
    // })

    // socket.emit(事件名,传递参数) 向自己广播
    socket.emit('newmsg',{
      from: socket.handshake.query.uname,
      time: new Date(),
      ct: res
    })

  })

  // 监听用户加入到群里的事件
  socket.on('iwant2join',()=>{
    // socket.join(房间) 加入到指定的房间
    socket.join('abc') 
  })

  // 局部群聊
  socket.on('msg4room',res=>{
    console.log('有群聊的消息啦！',res)
    // io.to(指定房间名).emit 来对房间里面的所有客户进行广播
    io.to('abc').emit('newmsg',{
      from: socket.handshake.query.uname,
      time: new Date(),
      ct: res,
      type:'群聊'
    })

  })

  // p2p 
  socket.on('p2p',res=>{
        const { to } = res;
        // 得到当前的而所有在线用户
        console.log('p2p reciver')
        const onlines = [];
        socket.nsp.sockets.forEach(item=>{
          onlines.push({
            uname: item.handshake.query.uname,
            socketid: item.id
          })
        })
          console.log('p2p onlines',onlines)
        const touser = onlines.find(item=>item.uname === to);
          console.log('p2p touser',touser)
          //  io.to(指定的socketid).emit() 向指定的scoketid客户 广播
        if(touser) io.to(touser.socketid).emit('newmsg',{
            from: socket.handshake.query.uname,
            time: new Date(),
            ct: res,
            type:'p2p'
        })
  })



})



//  引入socket的第四步  使用原生http来监听端口 不在使用原有的app.listen方法
httpServer.listen(3000,()=>{
  console.log('app is running at 3000');
})



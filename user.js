const express = require('express') // 引入express
const { render } = require('express/lib/response')
const router = express.Router() // 创建一个Router实例
const User = require('./models/user')
const Order = require('./models/user')
const util = require('utility')



/* curd操作 */

router.post('/add',async (req,res)=>{

     const { userName,phone,addr,pwd } = req.body;

     if(!userName ) return res.send({success:false,info:'用户名不能为空'})

     try { 

         const u = await User.create({
           userName,
           phone,
           addr,
          //  pwd: util.md5(pwd) // 中端局
         })
         // 高端局
         await User.findByIdAndUpdate(u.id,{
           pwd: util.md5(pwd + u.createdAt.getTime() )
         })

   
          res.send({success:true,info:'创建成功' })

     } catch (e) {
        
         res.send({success:false,info:'用户创建失败'})
     }






   
})

router.post('/delete', async (req,res)=>{

    //  await  User.deleteOne({userName:'dixon' })  // 指定添加删除1个
    //  await User.deleteMany({userName:'dixon'}) // 指定条件删除多个
    await User.findByIdAndRemove('6216ee5d2bc428742e726844')
     
     res.send({success:true,info:'删除成功'})

})

router.post('/update', async (req,res)=>{
  // await User.updateMany(更新谁，更新什么);
  //  await User.updateOne( {userName:'dixon'} , {
  //     userName:'superDixon',
  //     phone:'12345' })

  console.log('my decode info', req.decode);
  const  { phone } = req.body;
  const  { uid } = req.decode;
    
  await User.findByIdAndUpdate(uid,{
    phone
  })
  res.send({success:true,info:'update is ok'})
})

router.post('/getone',async (req,res)=>{

    // const u = await User.findOne({
    //   phone:'1111111'
    // })

    const u = await User.findById('6216ef3a24a391d49f34ef73');
    res.send({success:true,data:u})
})

router.post('/getall', async (req,res)=>{
  // User.find(找的条件,过滤字段)
  // 过滤字段的写法1  ['userName','phone']
  // 过滤字段的写法2  {userName:0,phone:1}
   const u = await User.find({
     userName:'dixon'
   }, {userName:0,phone:0});
    res.send({success:true,data:u})
})


router.use('/login',async (req,res)=>{
  const { userName,pwd } = req.body;
  const u = await User.findOne({ userName }) ;
  if(!u) return res.send({ success:false,info:'用户名或者密码不正确'})
  const curPwd = util.md5(pwd+ u.createdAt.getTime());
  console.log('curPwd',curPwd,u.createdAt.getTime(),pwd)
  console.log('pwd',u.pwd)
  if(curPwd === u.pwd) {
    const token = req.sign({uid:u._id});
    res.send({ success:true,info:'登录成功',token})
  } else {
    res.send({ success:false,info:'用户名或者密码不正确 err 4 pwd'})

  }
  console.log('处理用户登录')
})

router.use('/reg',(req,res)=>{
  console.log('处理用户注册')
})
router.use('/getPhone',(req,res)=>{
  console.log('获取用户手机号码')
})

router.use('/a/*/d',(req,res)=>{
  console.log('测试通配符')
})

router.use('/k/:kfc/:jgm',(req,res)=>{
  console.log('获取params参数',req.params)
})

router.get('/test',(req,res)=>{


    // res.render(模板文件,注入到模板的数据)
    res.render('a.nj',{
      title:'我是新闻标题',
      ct:'我是新闻内容',
      a: false,
      b: [
        {id:1,title:'我是标题1'},
        {id:2,title:'我是标题2'},
        {id:3,title:'我是标题3'},
      ],
      nav:[
        { name:'菜单1' },
        { name:'菜单2' },
        { name:'菜单3' },
      ]
    })

})


module.exports = router
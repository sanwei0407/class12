const express = require('express') // 引入express
const { render } = require('express/lib/response')
const router = express.Router() // 创建一个Router实例


router.use('/login',(req,res)=>{
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
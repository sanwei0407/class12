const express = require('express') // 引入express
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


module.exports = router
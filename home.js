var express=require('express')
var router=express.Router()
var mongoose=require('mongoose')
var bcrypt=require('bcrypt')
mongoose.connect("mongodb://localhost:27017/sample4")
var userSchema=mongoose.Schema({
    userName:String,
    lastName:String,
    email:String,
    password:String
})
var UserModal=mongoose.model("user",userSchema)

router.get("/",(req,res)=>{
  res.render('LoginPage',{status:"ok"})
})
router.get("/signup",(req,res)=>{
    res.render('CreateUser')
  })
  router.get("/home",(req,res)=>{
    res.render('Home')
  })

  router.post("/login",async(req,res)=>{
    console.log(req.body)
   var user= await UserModal.findOne({email:req.body.email})
  
   if(user){
    bcrypt.compare(req.body.password,user.password).then((response)=>{
        if(response)
        {
            res.render('Home',{user})
        }
        else{
           res.render('LoginPage',{status:"Password is Wrong"})
        }

    })

   }
   else
   {
    res.render('LoginPage',{status:"UserName is Wrong"})
   }    
   
  })
  router.post("/create-user",async(req,res)=>{
    
    var password=await bcrypt.hash(req.body.password,10)
    var user= new UserModal({
        userName:"Vinayak",
        lastName:req.body.lastname,
        email:req.body.email,
        password:password
    })
    user.save()
    res.redirect("/")



  })
module.exports=router
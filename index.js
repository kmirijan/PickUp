const express=require("express");
const app=express();
const port=process.env.PORT||8000;

app.use(express.static("public"));
app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/public/main.html");
});
app.listen(port,()=>{
    console.log(port);
})


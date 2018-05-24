var React=require("react");
var ReactDOM=require("react-dom");
var axios=require("axios");

var verify=(key,fn)=>{
  //takes hashed username and session keys
  //returns decrypted username and verifies if
  //the database contains the username and session key
  axios({
    url:"/verify-login",
    method:"post",
    data:{
      "key":key
    }
  }).then((res)=>{
    fn(res.data.user);
  })
}
export default{
  verify
}

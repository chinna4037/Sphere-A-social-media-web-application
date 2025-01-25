const ex=require("express");
const pg=require("pg");

const router=ex.Router();

const db=new pg.Client({
    user:"postgres",
    host:"localhost",
    database:"chinna",
    password:"chinna4037",
    port:5432,
});

db.connect();


router.get("/",async(req,res)=>{
    try{
        const result=await db.query("select * from images where type=$1",["video"]);
        if (result.rows.length === 0) {
          return res.status(200).send('Image not found');
        }
        for(var i=0;i<result.rows.length;i++){
          var x=result.rows[i];
          x={...x,date:((result.rows[i].date).toString()).substring(4,15)};
          x={...x,data:URLgenerator(x.data)};
          var userdata= await getUserDataWithUID(x.uid);
          if(userdata==="error"){
            throw new Error("Incorrect uid");
          }
          else{
            x={...x,...userdata};
          }
          img=[...img,x];
        }
        res.json(img);
    }catch(err){
        console.log(err);
        res.sendStatus(400);
    }
});

module.exports =  router;

async function getUserDataWithUID(x)  {
    try{
        const result=await db.query("select * from user_details where uid=$1",[x]);
        const user=await db.query("select * from login_credentials where uid=$1",[x]); 
    
        if(result.rows.length===0 || user.rows.length===0){
            throw new Error("incorrect uid");
        }
  
        var r=result.rows[0];
        r={username:user.rows[0].username,...r,profile:URLgenerator(r.profile)};
        return r;
    }
    catch(err){
      return "error";
    }
  }
  
  function URLgenerator(x){
    var base64Image = Buffer.from(x, "binary").toString(
      "base64"
    );
    var src = `data:video/mp4;base64,${base64Image}`; 
    return src;
  }
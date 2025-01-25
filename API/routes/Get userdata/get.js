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
    let uid=req.query.uid;
    try{
        const result=await db.query("select * from user_details where uid=$1",[uid]);
        const user=await db.query("select username from login_credentials where uid=$1",[uid]); 
    
        if(result.rows.length===0 || user.rows.length===0){
            throw new Error("incorrect uid");
        }

        var r=result.rows[0];
        r={username:user.rows[0].username,...r};
        res.send(r);
    }catch(err){
        res.sendStatus(400);
        console.log(err);
    }
});

router.get("/others",async(req,res)=>{
    let username=req.query.username;
    try{
        const user=await db.query("select uid from login_credentials where username=$1",[username]);
        if(user.rows.length===0){
            throw new Error("incorrect uid");
        }
        const result=await db.query("select profile from user_details where uid=$1",[user.rows[0].uid]);
        
        var r={username:username,profile:URLgenerator(result.rows[0].profile)};
        res.send(r);
    }catch(err){
        res.sendStatus(400);
        console.log(err);
    }

})

module.exports =  router;

function URLgenerator(x){
    var base64Image = Buffer.from(x, "binary").toString(
      "base64"
    );
    var src = `data:image/jpeg;base64,${base64Image}`; 
    return src;
}
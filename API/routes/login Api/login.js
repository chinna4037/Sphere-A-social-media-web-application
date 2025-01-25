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

router.post("/", async (req,res)=>{
    let username=req.body.username;
    let password=req.body.password;
    var  x="";
    console.log(username);
    console.log(password);
    try{
        const data=await db.query("select * from login_credentials where username=$1",[username]); 
        const r=data.rows;
        
        if(r.length==0){
            x="Invalid Username";
        }
        else{
            for( let i=0 ;i<r.length; i++){
                console.log(r[i]);
            }
            if(r[0].password==password){
                x={msg:"Valid User",
                   uid:r[0].uid };
            }
            else{
                x="Invalid Password";
            }
        }
    }
    catch(err){
        x="error during fetching from DB";
        console.log(err);
    }

    res.send(x);
});

module.exports =  router;
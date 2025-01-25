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
        const user=await db.query("select username,id from login_credentials where uid=$1",[uid]); 

        if(result.rows.length===0 || user.rows.length===0){
            throw new Error("incorrect uid");
        }
        // console.log(result.rows);
        // console.log(user.rows);
        const images=await db.query("select * from images where uid=$1",[uid]);
        const id=user.rows[0].id;
        var table1= "_following"+id;
        var table2="_followed"+id;
        const following=await db.query(`select * from ${table1}`);
        const followed=await db.query(`select * from ${table2}`);
        var x=result.rows[0];
        x={...x,
            username:user.rows[0].username,
            postsNo:images.rows.length,
            followedNo:followed.rows.length,
            followingNo:following.rows.length,
            profile:URLgenerator(x.profile)
        }
        // console.log(x);
        res.send(x);
    }
    catch(err){
        console.log(err);
        res.sendStatus(400);
    }
});

module.exports =  router;


function URLgenerator(x){
    var base64Image = Buffer.from(x, "binary").toString(
      "base64"
    );
    var src = `data:image/jpeg;base64,${base64Image}`; 
    return src;
}
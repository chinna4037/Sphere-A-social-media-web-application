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
    //console.log("history");
    let user1=req.query.username;
    let user2=req.query.selected;
    try{
        const ID=await db.query("select roomid from messages where (user1=$1 AND user2=$2) OR (user1=$2 AND user2=$1)",[user1,user2]);
        const roomid=ID.rows[0].roomid;
        const re=await db.query("select * from messages where roomid=$1",[roomid]);
        if(re.rows[0].data!==null){
            const String=JSON.parse((re.rows[0].data).toString());
            //console.log(String);
            res.send(String);
        }
        else{
            res.send([]);
        }
    }
    catch(err){
        console.log(err);
        res.sendStatus(400);
    }
});

module.exports=router;
const ex=require("express");
const pg=require("pg");
var addroom;

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
        const u=await db.query("select username from login_credentials where uid=$1",[uid]);
        let username=u.rows[0].username;
        const l1=await db.query("select user2 from messages where user1=$1",[username]);
        const l2=await db.query("select user1 from messages where user2=$1",[username]);
        var list=[]
        
        for (var i=0;i<l1.rows.length;i++){
            list=[...list,l1.rows[i].user2];
        }
        for (var i=0;i<l2.rows.length;i++){
            list=[...list,l2.rows[i].user1];
        }
        const all=await db.query("select roomid from messages where user1=$1 OR user2=$1",[username]);
        // for (var i=0;i<all.rows.length;i++){
        //     console.log(username);
        //     addroom(all.rows[i].roomid);
        // }
        res.send(list);
    }
    catch(err){
        console.log(err);
        res.sendStatus(400);
    }
});

module.exports = {
    router,
    getio :(par)=>{
        addroom=par;
    }
    };




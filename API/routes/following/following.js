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

router.get("/addToFollowing",async(req,res)=>{
    let uid=req.query.uid??"";
    let username=req.query.username??"";
    console.log(username);
    try{
        const ID=await db.query("select id from login_credentials where uid=$1",[uid]);
        const id=ID.rows[0].id;
        var table1="_following"+id;
        const r=await db.query("select id,uid from login_credentials where username=$1",[username]);
        if(r.rows.length!=0){
            var reqID=r.rows[0].id;
            var reqUID=r.rows[0].uid;
            const t1=await db.query(`insert into ${table1} (uid) values ($1)`,[reqUID]);
            var table2="_followed"+reqID;
            const t2=await db.query(`insert into ${table2} (uid) values ($1)`,[uid]);
            res.sendStatus(200);
        }else{
            res.sendStatus(400);
        }
    }
    catch(err){
        console.log(err);
        res.sendStatus(400);
    }
});

router.get("/removeFromFollowing",async(req,res)=>{
    let uid=req.query.uid??"";
    let username=req.query.username??"";
    console.log(username);
    try{
        const ID=await db.query("select id from login_credentials where uid=$1",[uid]);
        const id=ID.rows[0].id;
        var table1="_following"+id;
        const r=await db.query("select uid,id from login_credentials where username=$1",[username]);
        if(r.rows.length!=0){
            var reqID=r.rows[0].id;
            var reqUID=r.rows[0].uid;
            const t1=await db.query(`delete from ${table1} where uid=$1`,[reqUID]);
            var table2="_followed"+reqID;
            const t2=await db.query(`delete from ${table2} where uid=$1`,[uid]);
            res.sendStatus(200);
        }
        else{
            res.sendStatus(400);
        }
    }
    catch(err){
        console.log(err);
        res.sendStatus(400);
    }
});


module.exports =  router;
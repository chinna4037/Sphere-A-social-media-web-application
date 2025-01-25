const ex=require("express");
const pg=require("pg");
const url = require('url');
const querystring = require('querystring');

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

router.post("/",async(req,res)=>{
    
    try{
        var data = req.body;
        console.log("chat data");
        const r=await db.query("select roomid from messages where (user1=$1 AND user2=$2) OR (user1=$2 and user2=$1)",[data.author,data.to]);
        var roomid=r.rows[0].roomid;
        // console.log(roomid);
        const prev=await db.query("select data from messages where roomid=$1",[roomid]);
        var existingData;
        var concatenatedData;
        var binaryData;
        if(prev.rows[0].data!==null){
            console.log("notnull");
            var retrievedList = JSON.parse((prev.rows[0].data).toString());
            retrievedList=[...retrievedList,data];
            //console.log('Retrieved data:', retrievedList);
            concatenatedData=Buffer.from(JSON.stringify(retrievedList));

        }
        else{
            data=[data];
            binaryData=Buffer.from(JSON.stringify(data));
            concatenatedData=binaryData;
        }
        
        await db.query("update messages set data=$1 where roomid=$2",[concatenatedData,roomid]);
        const re=await db.query("select * from messages where roomid=$1",[roomid]);
        const String=JSON.parse((re.rows[0].data).toString());
        console.log(String);
        res.sendStatus(200);        
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
const ex=require("express");
const pg=require("pg");
const uniqid = require('uniqid');
const fs =require("fs");

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
    var x="";
    let firstname=req.body.firstname;
    let lastname=req.body.lastname;
    let email=req.body.email;
    let username=req.body.username;
    let password=req.body.password;
    var buffer;
    try{
        const data=await db.query("select * from login_credentials where username=$1",[username]); 
        const r=data.rows;    
        if(r.length==0){
            fs.readFile("profile.txt", async (err, bufferData) => {
                if (err) {
                    console.error('Error reading file:', err);
                    throw err;
                } 
                else {
                    buffer=bufferData;
                    var id=uniqid();
                    const IDS=await db.query("select id from login_credentials");
                    var listOfIds=[];
                    for(var i=0;i<IDS.rows.length;i++){
                        listOfIds=[...listOfIds,IDS.rows[i].id];
                    }
                    while(true){
                        if(listOfIds.indexOf(id)==-1){
                            break;
                        }
                        id=uniqid();
                    }
                     const uid=username+id;
                    await db.query("insert into login_credentials values ($1,$2,$3,$4)",[username,password,uid,id]);
                    await db.query("insert into user_details values ($1,$2,$3,$4,$5)",[uid,firstname,lastname,email,buffer]); 
                    res.send("successfully registered");
                    console.log("successfully registered");
                }
            });
        }else{
            x="Username already exists.Please choose different one";
            res.send(x);
        }

    }catch(err){
        x="error";
        console.log(err);
        res.send(x);
    }
    
});

module.exports = router;
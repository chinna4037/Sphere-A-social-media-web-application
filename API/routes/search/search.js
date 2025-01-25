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
    let entered=req.query.entered??"";
    try{
        const result= await db.query("select login_credentials.uid,username,profile from public.login_credentials inner join public.user_details on login_credentials.uid=user_details.uid where login_credentials.username LIKE $1||'%' AND login_credentials.uid!=$2",[entered,uid]);
        var x=result.rows;

        const ID=await db.query("select id from login_credentials where uid=$1",[uid]);
        const id=ID.rows[0].id;

        var table="select uid from _following"+id;
        const fr=await db.query(table);
        var frList=[];
        for(var i=0;i<fr.rows.length;i++){
            frList=[...frList,fr.rows[i].uid];
        }

        table="select uid from _followed"+id;
        const fb=await db.query(table);
        var fbList=[];
        for(var i=0;i<fb.rows.length;i++){
            fbList=[...fbList,fb.rows[i].uid];
        }

        if(x.length!=0){
            for(var i=0;i<x.length;i++){
                x[i]={...x[i],profile:URLgenerator(x[i].profile)};
                if(frList.indexOf(x[i].uid)!=-1){
                    x[i]={...x[i],following:true,followback:false};
                }
                else{
                    x[i]={...x[i],following:false,followback:false};
                }
                if(fbList.indexOf(x[i].uid)!=-1){
                    x[i]={...x[i],followback:true};
                }
                delete x[i].uid;
            }
        }
        res.send(x);
    }catch(err){
        console.log(err);
        res.sendStatus(400);
    }
});


module.exports = router;

function URLgenerator(x){
    var base64Image = Buffer.from(x, "binary").toString(
      "base64"
    );
    var src = `data:image/jpeg;base64,${base64Image}`; 
    return src;
}
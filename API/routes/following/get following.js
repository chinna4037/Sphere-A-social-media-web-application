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

router.get("/getFollowing",async(req,res)=>{
    let uid=req.query.uid??"";
    try{
        const ID=await db.query("select id from login_credentials where uid=$1",[uid]);
        if(ID.rows.length!=0){
            const id=ID.rows[0].id;
            var table="_following"+id;
            const list=await db.query(`select uid from ${table}`);

            var frList=[];
            for(var i=0;i<list.rows.length;i++){
                frList=[...frList,list.rows[i].uid];
            }

            table="_followed"+id;
            const fb=await db.query(`select uid from ${table}`);
            var fbList=[];
            for(var i=0;i<fb.rows.length;i++){
                fbList=[...fbList,fb.rows[i].uid];
            }
            
            var resList=[]
            for(var i=0;i<list.rows.length;i++){
                var x=await db.query("select username,profile,login_credentials.uid from public.login_credentials inner join public.user_details on login_credentials.uid=user_details.uid where login_credentials.uid=$1",[list.rows[i].uid]);
                if(x.rows.length!=0){
                    var obj={
                        username:x.rows[0].username,
                        profile:URLgenerator(x.rows[0].profile)   
                    };
                    
                    if(frList.indexOf(x.rows[0].uid)!=-1){
                        obj={...obj,following:true,followback:false};
                    }
                    else{
                        obj={...obj,following:false,followback:false};
                    }
                    if(fbList.indexOf(x.rows[0].uid)!=-1){
                        obj={...obj,followback:true};
                    }
                    resList=[...resList,obj];
                }
            }
            res.send(resList);
        }
       
    }catch(err){
        console.log(err);
        res.sendStatus(400);
    }
});

router.get("/getFollowers",async(req,res)=>{
    let uid=req.query.uid??"";
    try{
        const ID=await db.query("select id from login_credentials where uid=$1",[uid]);
        if(ID.rows.length!=0){
            const id=ID.rows[0].id;
            var table="_followed"+id;
            const list=await db.query(`select uid from ${table}`);

            var fbList=[];
            for(var i=0;i<list.rows.length;i++){
                fbList=[...fbList,list.rows[i].uid];
            }

            table="_following"+id;
            const fr=await db.query(`select uid from ${table}`);
            var frList=[];
            for(var i=0;i<fr.rows.length;i++){
                frList=[...frList,fr.rows[i].uid];
            }

            var resList=[]
            for(var i=0;i<list.rows.length;i++){
                var x=await db.query("select login_credentials.uid,username,profile from public.login_credentials inner join public.user_details on login_credentials.uid=user_details.uid where login_credentials.uid=$1",[list.rows[i].uid]);
                if(x.rows.length!=0){
                    var obj={
                        username:x.rows[0].username,
                        profile:URLgenerator(x.rows[0].profile)   
                    };
                    if(frList.indexOf(x.rows[0].uid)!=-1){
                        obj={...obj,following:true,followback:false};
                    }
                    else{
                        obj={...obj,following:false,followback:false};
                    }
                    if(fbList.indexOf(x.rows[0].uid)!=-1){
                        obj={...obj,followback:true};
                    }
                    resList=[...resList,obj];
                }  
            }
            res.send(resList);
        }
       
    }catch(err){
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
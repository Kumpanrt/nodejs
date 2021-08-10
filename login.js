var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
const { response } = require('express');
const { DH_UNABLE_TO_CHECK_GENERATOR } = require('constants');
const { request } = require('http');
const { clear } = require('console');


/*var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'',
    database:'account'
});*/

//prisma
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()



var app= express();
/*app.use(session({
    secret:'secret',
    resave: true,
    saveUninitialized: true
}));*/
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.get('/',function(request, response){
    response.sendFile(path.join(__dirname + '/login.html'));
    return response.send({error: false, message: 'crud test'})
});
/*app.post('/auth', async (req, res) => {
    const {uid, name, password} = req.body;
        const au = await prisma.accounts.findUnique({
            where:{
                uid: parseInt(uid),
                name: name,
            },
            select:{
                name: true,
                password: true,
            },
        })
        res.json("hello");
    })*/
            






/*app.get('/user', function (request, response) {
    async function main() {
        const allaccounts = await prisma.accounts.findMany()
        console.log(allaccounts)
      }
})*/
app.get('/home', function(request,response){
    if (request.session.loggedin){
        response.send('hello' + request.session.username + '!');
    }else{
        response.send('please login');
    }
    response.end;
    }
    
);
//show user acc
app.get('/user', async (req, res) => {
    const allaccounts = await prisma.accounts.findMany()
        console.log(allaccounts)
      
        res.json(allaccounts);
    })

//creat useracc

app.post('/user', async (req, res )=>{
    const {name, password} = req.body;
    if(!name || !password){
        return res.status(400).send({error: true, message:"please enter name and password"});
    }
    const Cuser = await prisma.accounts.create({
        data: {
            name: name,
            password: password,
        },
    });

    res.json("create done");
});

/*updatepassword*/
app.put('/user', async (req, res )=>{
    const {uid, password} = req.body;
    if(!uid || !password){
        return res.status(400).send({error: true, message:"please enter uid and password"});
    }
    const Upuser = await prisma.accounts.update({
        where :{
            uid: parseInt(uid),
        },
        data: {
            password: password,
        },
        
    });
    res.json(`update profiles ${uid} is done`);
})

//delete useracc
app.delete('/user', async (req, res )=>{
    const uid = req.body.uid;
    if(!uid){
        return res.status(400).send({error: true, message:"please enter uid"});
    }
    const Duser = await prisma.accounts.delete({
        where: {
            uid: parseInt(uid),
        },
    })
    res.json(`delete profiles ${uid} is done`);
});

/*app.put('/user', async (req, res) => {
    const {uid, password} = req.body;
    const Upass = await prisma.accounts.update({
        Where: {
            uid: uid,
        },
        data: {
            password: password,
        },
    })
    console.log(allaccounts)
    res.json(Upass);
});*/

/*display profiles */
app.post('/profile', async (req, res )=>{
    var username = req.body.username;
    var password = req.body.password;
    if (username && password) {

        connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?',[username,password],function(error, results, feilds){
            console.log(results)
            console.log(error)
            console.log(feilds)
            if (results.length > 0 ){
                request.session.loggedin = true;
                request.session.username = username;
                response.redirect('/profiles');
                /*response.status(200).json("55555")*/
                
            
            }else {
                response.send('Wrong Username or Password');
            }
            response.end();
        });
    }else {
        response.send('please enter user and pass');
        response.end;
    }
});
/*display profiles allpro */

app.get('/profiles', async (req, res) => {
    const allpro = await prisma.profiles.findMany()
        console.log(allpro)
      
        res.json(allpro);
    })


/*insert profiles Cpro */
app.post('/profiles', async (req, res )=>{
    const {name} = req.body;
    if(!name ){
        return res.status(400).send({error: true, message:"please enter name"});
    }
    const Cpro = await prisma.profiles.create({
        data: {
            name: name,
        },
    });

    res.json("create done");
})

/*update profiles Uppro*/
app.put('/profiles', async (req, res )=>{
    const {pid, name} = req.body;
    if(!pid || !name){
        return res.status(400).send({error: true, message:"please enter uid and name"});
    }
        const Uppro = await prisma.profiles.update({
            where :{
                pid: parseInt(pid),
            },
            data: {
                name: name,
            },
            
        });
        
        res.json(`update profiles ${pid} is done`);
    
});
/*delete profile*/
app.delete('/profiles', async (req, res )=>{
    const pid = req.body.pid;
    if(!pid){
        return res.status(400).send({error: true, message:"please enter pid"});
    }
    const Dpro = await prisma.profiles.delete({
        where: {
            pid: parseInt(pid),
        },
    })
    res.json(`delete profiles ${pid} is done`);
})

/*display post */
/*app.post('/post', async (req, res )=>{
    const {name, password} = req.body;
    if (name && password) {

        connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?',[username,password],function(error, results, feilds){
            console.log(results)
            console.log(error)
            console.log(feilds)
            if (results.length > 0 ){
                request.session.loggedin = true;
                request.session.username = username;
                response.redirect('/posts');
                /*response.status(200).json("55555")*/
                
            
            /*}else {
                response.send('Wrong Username or Password');
            }
            response.end();
        });
    }else {
        response.send('please enter user and pass');
        response.end;
    }
});*/

/*display post */
app.get('/posts',async (req, res) => {
        const allpost = await prisma.posts.findMany()
            console.log(allpost)
          
            res.json(allpost);
})

/*create post  Cpost*/
app.post('/posts', async (req, res )=>{
    const {name} = req.body;
    if(!name){
        return res.status(400).send({error: true, message:"please enter name"});
    }
    const Cpost = await prisma.posts.create({
        data: {
            name: name,
        },
    });

    res.json("create done");
});
/*update post*/
app.put('/posts', async (req, res )=>{
    const {poid, name} = req.body;
    if(!poid || !name){
        return res.status(400).send({error: true, message:"please enter poid and name"});
    }
    const Uppost = await prisma.posts.update({
        where :{
            poid: parseInt(poid),
        },
        data: {
            name: name,
        },
        
    });
    res.json(`update profiles ${poid} is done`);
})
/*delete post*/
app.delete('/posts', async (req, res )=>{
    const poid = req.params.poid;
    if(!poid){
        return res.status(400).send({error: true, message:"please enter poid"});
    }
    const Dpost = await prisma.posts.delete({
        where: {
            poid: parseInt(poid),
        },
    })
    res.json(`delete profiles ${poid} is done`);
});
/*categorise profile */
app.get('/categorise/profile/:pid', async (req, res )=>{
    const pid = req.params.pid;
    const getpro = await prisma.profiles.findUnique({
        where: {
          pid: parseInt(pid),
        },
        select: {
          name: true,
        },
      })
    res.json(getpro);
    });       
    
/*categorise post */
app.get('/categorise/post/:poid', async (req, res )=>{
    const poid = req.params.poid;
    const getpo = await prisma.posts.findUnique({
        where: {
          poid: parseInt(poid),
        },
        select: {
          name: true,
        },
      })
    res.json(getpo);
    });  
    

app.get('/logout',function(request, response){
/*request.session = null
response.status(200).json("log out success");*/
    request.session.destroy((error) => {
        if(error) {
            return console.log(error);
            
        }
        response.clearCookie("connect.sid");
        response.status(200).json("log out success");
     });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server is run port ${PORT}`)); 

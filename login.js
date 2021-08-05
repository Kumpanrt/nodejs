var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
const { response } = require('express');
const { DH_UNABLE_TO_CHECK_GENERATOR } = require('constants');
const { request } = require('http');
const { clear } = require('console');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'',
    database:'account'
});


var app= express();
app.use(session({
    secret:'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.get('/',function(request, response){
    response.sendFile(path.join(__dirname + '/login.html'));
    return response.send({error: false, message: 'crud test'})
});
app.post('/auth', function(request, response){
    var username = request.body.username;
    var password = request.body.password;
    if (username && password) {

        connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?',[username,password],function(error, results, feilds){
            console.log(results)
            console.log(error)
            console.log(feilds)
            if (results.length > 0 ){
                request.session.loggedin = true;
                request.session.username = username;
                /*response.redirect('/home');*/
                response.status(200).json("55555");
                
            
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

app.get('/home', function(request,response){
    if (request.session.loggedin){
        response.send('hello' + request.session.username + '!');
    }else{
        response.send('please login');
    }
    response.end;
    }
    
);
/*updatepassword*/
app.put('/user', function(request, response) {
    let id = request.body.id;
    let password = request.body.password;
    if(!id || !password){
        return response.status(400).send({error: true, message:"enter password or id"});
    }else{
        connection.query('UPDATE accounts SET password = ? WHERE id = ?', [password, id], (error, results , feilds)=>{
            if(error) throw error;
            let message = "error";
            if(results.changedRows === 0){
            messgae = "empty or same";
            }else{
            message = " update done";
            }
            return response.send({error: false, data: results, message: message});
         })
        
        }
});

/*display profiles */
app.post('/profile', function(request, response){
    var username = request.body.username;
    var password = request.body.password;
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
/*display profiles */

app.get('/profiles', function (request, response) {
    connection.query('SELECT * FROM profiles', (error, results, feilds) =>{
       if(error) throw error;
       let message = "";
       if(results === undefined || results.length == 0){
           messgae = "empty";
       }else{
           message = "done";
       }
       return response.send({error: false, data: results, message: message});
    })
})

/*insert profiles */
app.post('/profiles', function(request, response){
    let name = request.body.name;
    if(!name){
        return response.status(400).send({error: true, message:"enter name"});
    }else{
        connection.query('INSERT INTO profiles (name) VALUES(?)', [name], (error,results,feilds) => {
            if(error) throw error;
            return response.send({error: false, data: results, message: "done"});
        })
    }
})
/*update profiles*/
app.put('/profiles', function(request, response) {
    let id = request.body.id;
    let name = request.body.name;
    if(!id || !name){
        return response.status(400).send({error: true, message:"enter name or id"});
    }else{
        connection.query('UPDATE profiles SET name = ? WHERE id = ?', [name, id], (error, results , feilds)=>{
            if(error) throw error;
            let message = "";
            if(results.changedRows === 0){
            messgae = "empty or same";
            }else{
            message = " update done";
            }
            return response.send({error: false, data: results, message: message});
         })
        
        }
});
/*delete profile*/
app.delete('/profiles', function(request, response) {
    let id =request.body.id;
    if(!id ){
        return response.status(400).send({error: true, message:"please select id"});
    }else{
        connection.query('DELETE FROM profiles WHERE id = ?', [id], (error, results, feilds)=>{
            if(error) throw error;
            let message = "";
            if(results.affectedRows === 0){
            messgae = "not found id";
            }else{
            message = " update done";
            }
            return response.send({error: false, data: results, message: message});
         
        })
    }
})
/*display post */
app.post('/post', function(request, response){
    var username = request.body.username;
    var password = request.body.password;
    if (username && password) {

        connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?',[username,password],function(error, results, feilds){
            console.log(results)
            console.log(error)
            console.log(feilds)
            if (results.length > 0 ){
                request.session.loggedin = true;
                request.session.username = username;
                response.redirect('/posts');
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
/*display post */

app.get('/posts', function (request, response) {
    connection.query('SELECT * FROM posts', (error, results, feilds) =>{
       if(error) throw error;
       let message = "";
       if(results === undefined || results.length == 0){
           messgae = "empty";
       }else{
           message = "done";
       }
       return response.send({error: false, data: results, message: message});
    })
})

/*insert post */
app.post('/posts', function(request, response){
    let name = request.body.name;
    if(!name){
        return response.status(400).send({error: true, message:"enter name"});
    }else{
        connection.query('INSERT INTO posts (name) VALUES(?)', [name], (error,results,feilds) => {
            if(error) throw error;
            return response.send({error: false, data: results, message: "done"});
        })
    }
})
/*update post*/
app.put('/posts', function(request, response) {
    let id = request.body.id;
    let name = request.body.name;
    if(!id || !name){
        return response.status(400).send({error: true, message:"enter name or id"});
    }else{
        connection.query('UPDATE posts SET name = ? WHERE id = ?', [name, id], (error, results , feilds)=>{
            if(error) throw error;
            let message = "";
            if(results.changedRows === 0){
            messgae = "empty or same";
            }else{
            message = " update done";
            }
            return response.send({error: false, data: results, message: message});
         })
        
        }
});
/*delete post*/
app.delete('/posts', function(request, response) {
    let id =request.body.id;
    if(!id ){
        return response.status(400).send({error: true, message:"please select id"});
    }else{
        connection.query('DELETE FROM posts WHERE id = ?', [id], (error, results, feilds)=>{
            if(error) throw error;
            let message = "";
            if(results.affectedRows === 0){
            messgae = "not found id";
            }else{
            message = " update done";
            }
            return response.send({error: false, data: results, message: message});
         
        })
    }
})
/*categorise profile */
app.get('/categorise/profile/:id', function(request, response){
    let id =request.params.id;
    connection.query('SELECT * FROM profiles WHERE id = ?', [id], (error, results, feilds)=>{
        if(error) throw error;
        let message = "";
        if(results.affectedRows === 0){
        messgae = "not found id";
        }else{
        message = "done";
        }
        return response.send({error: false, data: results, message: message});
     
    })
    
})
/*categorise post */
app.get('/categorise/post/:id', function(request, response){
    let id =request.params.id;
    connection.query('SELECT * FROM posts WHERE id = ?', [id], (error, results, feilds)=>{
        if(error) throw error;
        let message = "";
        if(results.affectedRows === 0){
        messgae = "not found id";
        }else{
        message = "done";
        }
        return response.send({error: false, data: results, message: message});
     
    })
    
})
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


app.listen(3000);
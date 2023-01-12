var con = require('./connection');

const express = require("express");
var app = express();
var mysql =require('mysql');
var bodyParser = require('body-parser');
var session =require('express-session')


//connection to register.html ---=======----- for the students
app.get('/',function(req,res){
    res.sendFile(__dirname+'/register.html');
})

//---This is th post function  student------------

app.post('/',function(req,res) {
    //console.log(req.body);
    var name = req.body.name;
    var age = req.body.age;
    var mark1 = req.body.mark1;
    var mark2 = req.body.mark2;

    con.connect(function(error){
        if(error) throw error;

        var sql = "INSERT INTO students(name,email,password,cpassword) VALUES ?";

        var values = [
            [name,age,mark1,mark2]
        ];


        con.query(sql,[values],function(error,result){
            if (error) throw error;
            //res.send('Student Register successfull'+result.insertId);
            res.redirect('/students');
        });
    }); 
});

app.get('/students',function(req,res) {
//=====--------------------------
    if (req.session.loggedin){
        res.render('welcome', {user: `${req.session.email}`});

    }else{
        res.send("<h1>Please login to view this page</h1>")
    }
// ---------------------------------------------------    
    con.connect(function(error) {
        if(error) console.log(error);

        var sql = "select * from students";
        con.query(sql,function(error,result) {
            if (error) console.log(error);
            //console.log(result);
            res.render(__dirname+"/students", {students:result});
        });
    });
});

app.get('/delete-student',function(req,res){
    con.connect(function(error) {
        if(error) console.log(error);

        var sql = "delete from students where id=?";

        var id = req.query.id;

        con.query(sql,[id],function(error,result) {
            if (error) console.log(error);
            //console.log(result);
            //res.render(__dirname+"/students", {students:result});
            res.redirect('/students');  //delete the id again redirect the page students

        });
    });
});

//For the update the students   -------------------------
app.get('/edit-student',function(req,res){
    con.connect(function(error) {
        if(error) console.log(error);

        var sql = "select * from students where id=?";

        var id = req.query.id;

        con.query(sql,[id],function(error,result) {
            if (error) console.log(error);
            //console.log(result);
            //res.render(__dirname+"/students", {students:result});
            //res.redirect('/students');  //delete the id again redirect the page students
            res.render(__dirname+"/edit-student",{student : result});

        });
    });
});


//For the  View the students-------------------------------------

app.get('/view-student',function(req,res){
    con.connect(function(error) {
        if(error) console.log(error);

        var sql = " select * from students where id=?";

        var id = req.query.id;

        con.query(sql,[id],function(error,result) {
            if (error) console.log(error);
            //console.log(result);
            res.render(__dirname+"/students", {students:result});
            //res.redirect('/students');  //delete the id again redirect the page students

        });
    });
});


//For the Redirect Update with direct the on redirect the students-----------------
app.post('/edit-student',function(req,res) {

    var name = req.body.name;
    var age = req.body.age;
    var mark1 = req.body.mark1;
    var mark2 = req.body.mark2;
    var id = req.body.id;

    con.connect(function(error) {
        if(error) console.log(error);

        var sql = "UPDATE students set name=?, email=?, password=?, cpassword=?  where id=?";

        //var id = req.query.id;

        con.query(sql,[name,email,password,cpassword,id],function(error,result) {
            if (error) console.log(error);
            //console.log(result);
            //res.render(__dirname+"/students", {students:result});
            res.redirect('/students');  //edit  the id again redirect the page students
           // res.render(__dirname+"/edit-student",{student : result});

        });
    });
})

//-------------------------end of the user list



//this is for the clean the caches
app.use(function(req,res,next){
    res.set('Cache-Control','no-cache,private,must-revalidate,no-store');
    next();
})


app.use(session({
    secret:'secret',
    resave: true,
    saveUninitialized: true
}))

app.use(bodyParser.urlencoded({exrended : true}));
app.use(bodyParser.json());

var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database:"nodejs-login"
})

conn.connect(function(err) {
    if(err) throw err;
    console.log("connected");
})


app.set('view engine','ejs');

app.get('/',function(req,res){
    //res.send("<h1> Hello world!</h1>")
    res.render('signup');
});


app.post('/signup',function(req,res){
    var name = req.body.name;
    var age = req.body.age;
    var mark1 = req.body.mark1;
    
    var sql = `insert into users(name,email,password) values ('${name}','${email}','${password}')`;

    conn.query(sql,function(err,result){
        if (err) throw err;
        //res.send('Student Register successfull'+result.insertId);
        //res.redirect('/students');
        res.send("<h1>User Successfully registered....</h1>")
    });

})



app.get('/login',function(req,res){
    //res.send("<h1> Hello world!</h1>")
    res.render('login');
});



app.post('/login',function(req,res){
    //res.send("<h1> Hello world!</h1>")
    //res.render('login');
    var name = req.body.name;
    var password = req.body.password;
    if (name && age){
        var sql = `select * from users where age='${name}' AND  password ='${password}'`;
        conn.query(sql,function(err,result){
            if(result.length>0 ){
                req.session.loggedin=true;
                req.session.email=email;
                res.redirect('/welcome');
            }else{
                res.send("<h1>Incorrect Email or password !</h1>");
            }
        });
    }else{
        res.send("<h1>Please Enter email or password ! </h1>")
    }
});


//It is connected the welcome by using the email of session email 
app.get('/welcome',function(req,res){
    if (req.session.loggedin){
        res.render('welcome', {user: `${req.session.name}`});

    }else{
        res.send("<h1>Please login to view this page</h1>")
    }
    //res.render('welcome');
});


//It is connected to the students.ejs
app.get('/student',function(req,res){
    if (req.session.loggedin){
        res.render('welcome', {user: `${req.session.email}`});

    }else{
        res.send("<h1>Please login to view this page</h1>")
    }
    //res.render('welcome');
});





app.get('/logout',function(req,res){
    req.session.destroy((err)=> {
        res.redirect('/login');
    })
});


var server = app.listen(4000,function(){
    console.log("go to port number 4000")
})
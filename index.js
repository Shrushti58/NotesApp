const express=require('express');
const path = require('path');
const app=express();
const fs = require('fs');
const methodOverride = require('method-override');
const { render } = require('ejs');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
app.use(methodOverride('_method'));
app.set('view engine','ejs');

app.get("/",function(req,res){
    fs.readdir(`./files`,function(err,files){
        console.log(files);
        res.render("index",{files:files});

    })
});

app.get("/file/:filename",function(req,res){
    fs.readFile(`./files/${req.params.filename}`,"utf-8",function(err,filedata)
{
    res.render("show",{filename:req.params.filename,filedata:filedata});
});
});

app.post("/create",function(req,res){
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`,req.body.details,function(err){
    res.redirect('/');
    })
});

app.get("/edit/:filename",function(req,res){
    fs.readFile(`./files/${req.params.filename}`,"utf-8",function(err,filedata)
    {

        res.render('edit',{filename:req.params.filename,filedata:filedata});
    });
    
});


app.post('/edit',function(req,res)
{
    console.log(req.body.new);
    fs.rename(`./files/${req.body.previous}`,`./files/${req.body.new}.txt`,function(err){
        console.log(err);
    });
    
    res.redirect('/');

});


app.get("/delete/:filename",function(req,res){
    res.render('delete',{filename:req.params.filename});
});


app.post('/delete',function(req,res)
{
    fs.unlink(`./files/${req.body.del}`,function(err){
        console.log(err);
    })
    res.redirect('/')

});



app.listen(3000,function(){
    console.log("Server Running!");
});
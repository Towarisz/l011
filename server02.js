const express = require("express")
var hbs = require('express-handlebars');
let app = express()
const PORT =  process.env.PORT || 3000;;

const Datastore = require('nedb')

const coll1 = new Datastore({
    filename: 'kolekcja.db',
    autoload: true
});
app.use(express.json());

app.set('views', __dirname + '/views');
app.engine('hbs', hbs({
    extname: '.hbs',
    partialsDir: "views/partials",
}));
app.set('view engine', 'hbs');

app.get("/", (req, res) => {
    coll1.find({}, (err, docs) => {
        let help = { "a": docs }
        res.render("view1.hbs", help)
    })
})

app.get("/data", (req, res) => {
    coll1.insert(
        {
            ubezpieczony: req.query.a == undefined ? "Nie" : "Tak",
            benzyna: req.query.b == undefined ? "Nie" : "Tak",
            uszkodzony: req.query.c == undefined ? "Nie" : "Tak",
            napend4x4: req.query.d == undefined ? "Nie" : "Tak"
        }, () => {
            res.redirect("/")
        })
})

app.get("/edit", (req, res) => {
    coll1.update({},{$unset:{edit:true}},{multi: true},()=>{
        coll1.update({_id:req.query.id},{$push:{edit:true}},(err,doc)=>{
            res.redirect("/")
        })
    })
})

app.get("/remove", (req, res) => {
    coll1.remove({ _id: req.query.id }, () => {
        res.redirect("/")
    })
})
app.get("/update",(req,res)=>{
    coll1.update({_id:req.query.id},{$unset:{edit:true}},()=>{
        coll1.update({_id:req.query.id},{$set:{ubezpieczony:req.query.s1,benzyna:req.query.s2,uszkodzony:req.query.s3,napend4x4:req.query.s4}},()=>{
            res.redirect("/")
        })
    })
})
app.get("/cancel",(req,res)=>{
    coll1.update({_id:req.query.id},{$unset:{edit:true}},()=>{
        res.redirect("/")
    })
})

app.use(express.static('static'))

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})
const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
//const ejs = require('ejs');
//App init
const app = express();
const port = 3000;
//Body Parser Middleware
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({external: false}));
app.use(express.static(path.join(__dirname, 'public')));

//View Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//connect to db

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/todos'
MongoClient.connect(url,(err,database) => {
// if(err){
//   console.log('Error', err);
//         }
  console.log("Connected Successfully",);
  db = database;
  Todos = db.collection('todos');

    app.get('/', (req, res, next) => {
    Todos.find({}).toArray((err,todos) =>{
    if(err){
      console.log(err);
    }
    console.log(todos);
      res.render('index', {
        Todos: todos
      });
      });
      });
//Add Route

app.post('/todo/add', (req,res,next) => {
const todo = {
  text: req.body.text,
  desc: req.body.body
}

Todos.insert(todo, (err, result) => {
  console.log(result);
  res.redirect('/');
})
});
//Add ROute end

//Delete ROute
app.delete('/todo/delete/:id', (req,res,next) => {

var query = {_id: ObjectID(req.params.id)};
  Todos.deleteOne(query, (err, response) => {
    if(err){
      console.log(err);
    }
    console.log(response);
    res.send(200)
  });
})

//Delete ROute End

//Update ROute
//Update - Get Data into form
app.get('/todo/edit/:id', (req, res, next) => {
const query = {_id: ObjectID(req.params.id)}
Todos.find(query).next((err, todo) => {
  if(err){
    console.log('Error', err);
  }
  res.render('edit', {
    todo: todo
  });
  });
  });
//Update- Post NEw data
app.post('/todo/edit/:id', (req,res,next) => {
  const query = {_id: ObjectID(req.params.id)}

  const todo = {
    text: req.body.text,
    desc: req.body.body
  }
//Update query
Todos.updateOne(query, {$set: todo}, (err,result) => {
  if(err){
    console.log('err', err);
  }
  console.log('Todo Updated');
  res.redirect('/')
})
})
//Update Route end

    app.listen(port, () => {
      console.log('Server Running on Port', port);
    });

    });

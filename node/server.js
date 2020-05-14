// 1- create a folder for project
// 2-npm init (use your own or use default)
//3- npm install --save-dev eslint eslint-plugin-import eslint-plugin-node eslint-plugin-promise eslint-plugin-standard eslint-config-standard
//4- npm install express
"use strict";
const DB = require("./dao");
//force variable declaration before they can  be used
// npm install pg
const express = require("express");
const app = express();

app.use(express.static("public_html"));

//E JS template engine setup
//templates must be in views folder
app.set("view engine", "ejs");

//use CORS(npm install cors)
//make the API available to everyone in teh universe
var cors = require("cors");
app.use(cors());

//Home page
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/public_html/index.html");
});

app.listen(8000, function() {
  console.log("server listening to port 8000");
});
app.use(express.json()); //used to parse json boides
app.use(express.urlencoded());

//RESt API for ajax calls------------

//get the list of all tracks
app.get("/tracks", function(request, response) {
  // response.sendFile(__dirname+'/index.html')
  DB.connect();
  DB.query(
    "select track.id as id, track.playlist_id as playlist_id, track.title as track_title, track.uri, track.master_id, playlist.id as play_id, playlist.title as playlist_title from track, playlist where track.playlist_id=playlist.id order by track.id asc",
    [],
    result => {
      console.log("Number of rows in table: " + result.rowCount);
      let reply = {}; //initialize empty object
      if (result.rowCount != 0) {
        reply.message = "OK track found..! " + result.rowCount + "tracks";
        reply.db_data = result.rows;
        response.status(200).send(reply);
        //specifing content type explicity
        //response.writeHead(200,{'Content-Type':'application/json'});
        //const ObjectString = JSON.stringify(reply, null, 4)
        //response.end(ObjectString);
      } else {
        reply.message = "track table is empty";
        reply.db_data = {};
        response.status(404).send(reply);
      }
    }
  );
});

//for delete
app.delete("/tracks/:id", function(req, res) {
  let id_from_form = req.params.id; // id is from the form input name='id'
  if (id_from_form == "") {
    let reply = {};
    reply.message = "Error ! id do not exist";
    reply.db_data = {};
    res.status(400).send(reply);
  } else {
    let reply = {};
    DB.connect();
    DB.query("select * from track where id=$1 ", [id_from_form], result => {
      if (result.rowCount != 0) {
        DB.query("delete  from track where id=$1 ", [id_from_form], result => {
          reply.message = "Track deleted";
          res.status(200).send(reply);
        });
      } else {
        reply.message = "Track table does not have an id you enetered";
        reply.db_data = {};
        res.status(404).send(reply);
      }
    });
  }
});

//for insert
app.post("/tracks", function(req, res) {
  let reply = {};
  DB.connect();
  DB.query(
    "insert into track(playlist_id, title, uri, master_id) values('" +
      req.body.playlist_id +
      "','" +
      req.body.title +
      "','" +
      req.body.uri +
      "','" +
      req.body.masterId +
      "')",
    [],
    result => {
      reply.message = "track inserted";
      res.status(200).send(reply);
    }
  );
});

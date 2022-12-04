const express = require('express');
const app = express();
const port = 3000;

const{ initializeApp, cert} = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore"); 

var serviceAccount = require("./key.json");

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();


app.set('view engine', "ejs")

app.get('/', (req,res) => {
	res.send('Hello!')
});

app.get('/signin', (req,res) => {
	res.render("signin")
});

app.get('/signinsubmit', (req,res) => {
	const email = req.query.email;
	const password = req.query.password;

	db.collection("users")
	  .where("email", "==", email)
	  .where("password", "==", password)
	  .get()
	  .then((docs) => {
	  	if(docs.size > 0){
	  		//res.send("LOGIN SUCCESSFUL");
	  		res.render("home");
	  	}
	  	else{
	  		res.send("LOGIN FAILED");
	  	}
	  });
});


app.get('/signupsubmit', (req,res) => {
	const username = req.query.username;
	const email = req.query.email;
	const password = req.query.password;
	
	db.collection('users').add({
		username : username,
		email : email,
		password : password,
	}).then(() => {
		res.render("signin");
	});
});

app.get('/signup', (req,res) => {
	res.render("signup")
});

app.listen(port, () => {
	console.log('Example app listening on port ' +port)
});
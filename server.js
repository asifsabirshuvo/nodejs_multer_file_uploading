    const express = require('express');
    const bodyParser = require('body-parser');
    const multer = require('multer');
    const upload = multer({ dest: './public/uploads/' });
    const path = require('path');
    var mongojs =  require('mongojs');
    var db =  mongojs("mongodb://localhost:27017/multerDb",['data']);

    const port =  process.env.PORT || 8080;

    const app =  express();

	//View Engine to show the js data in plain html

	app.set('view engine','ejs');
	app.set('views',path.join(__dirname,'views'));


	//body parser middleware because we are getting form data
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended:false}));

	//set static path for uploads and others
	app.use(express.static(path.join(__dirname,'public')));



// GET / route for serving index.html file for first localhost:8080 call

app.get('/', (req, res) => {

        db.data.find().sort({_id:-1}).toArray((err,docs)=>{     //sort _id:-1 for descending query and get the latest upload first
            res.render('index',{
                data: docs,
                info:'status'
            });
        });
    });

// GET route WITH INFO for serving index.html file

    app.get('/:extra', (req, res) => {

        var extraInfo =  req.params.extra;

        db.data.find().sort({_id:-1}).toArray((err,docs)=>{
            res.render('index',{
                data: docs,
                info: extraInfo
            });
        });
    });




//############### HANDLING SINGLE FILE UPLOAD #################

    app.post('/upload/single', upload.single('singleFile'), (req, res) => {
        if (req.file) {
            console.log('Uploading single file...');
            var filename = req.file.filename;
        } else {
            console.log('No single File Uploaded');

        }

        // just a single json
        var newEntry = {
            title: req.body.title,
            date: new Date(),
            filename: path.join('uploads/', filename )
        };

        //pushing to server
        db.data.insert(newEntry,function(err,result){
            if(err){
                console.log(err);
            }
        })   

        res.redirect( '/'+'success single');
        
    });



//############### HANDLING MULTIPLE FILE UPLOAD #################

    app.post('/upload/multi', upload.array('multiFile',4), (req, res) => {


        if (req.files) {
            console.log('Uploading multiple file...');
        } else {
            console.log('No multi File Uploaded');
        }

        
        // creating json array
        var newEntry = [];
        for(var i=0;i<req.files.length;i++){
            var entry = {
                title: req.body.title,
                date: new Date(),
                filename: path.join('uploads/', req.files[i].filename )
            }
            newEntry.push(entry);
        }


        //pushing to server
        db.data.insert(newEntry,function(err,result){
            if(err){
                console.log(err);
                res.redirect('/',{info: 'An error occured in multiple image server entry.'});

            }
        })   

        res.redirect('/'+'success multi');
        
    });



    // To make the server live
    app.listen(port, () => {
        console.log(`App is live on port ${port}`);
    });

### Install npm, nodejs, mongo from here: 

> https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

> https://docs.mongodb.com/manual/installation/


### we will need some dependencies.

> npm install multer express body-parser path mongojs ejs


### Let's create our multerDb database and data collection
### To start the mongo daemon service: 

> sudo service mongod start

### Now to go mongo command line:

> mongo
	
> use multerDb

> db.createCollection('data')

### Now mongodb is set. Let's run the project.

> nodemon server

### Now the server is live at localhost:8080 port. go to browser and check.



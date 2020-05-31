const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');
const app = express();
const swaggerJsDoc=require('swagger-jsdoc');
const swaggerUi =require('swagger-ui-express');

// Passport Config
require('./config/passport')(passport);

// DB Config
const mongoURI = 'mongodb+srv://b6:y6bVkAtNvFsbKOeo@cluster0-xcap6.gcp.mongodb.net/b6?retryWrites=true&w=majority'

const db = require('./config/keys').mongoURI;


// Connect to MongoDB
// mongoose
//   .connect(
//     db,
//     { useNewUrlParser: true }
//   )
//   .then(() => console.log('MongoDB Connected'))
//   .catch(err => console.log(err));

mongoose
  .connect(mongoURI,{
    useNewUrlParser: true, 
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(result => {
    console.log('server run!');
    app.listen(process.env.store || 1212);
  })
  .catch(err => {
    console.log(err);
  });
//Set Header
app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers','Content-Type, api_key');
  next();
});
// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);
//Connect CSS
app.use(express.static(path.join(__dirname,'public')));
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));

const swaggerOptions={
  swaggerDefinition: {
      info: {
          title: 'Restful API',
          description: "API information",
          contact: {
              name: "Cao Thanh Ngân"
          },
          servers: ["http://localhost:3000"]
      },
      'openapi': '3.0.0'
  },
  apis: ["app.js"]
};
/**
 * @swagger
 * /user/createcomment:
 *   post:
 *    summary: Create new Comment. 
  *    responses:
 *      '201':
 *        description: A JSON message created success
  *      '422':
 *        description: A JSON invalid input success
 *      '500':
 *        description: A JSON message created fail
*/
const swaggerDocs=swaggerJsDoc(swaggerOptions);
app.use('/apidocs',swaggerUi.serve,swaggerUi.setup(swaggerDocs));



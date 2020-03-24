require('dotenv').config();
const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors");
const logger = require('morgan')

const expressJwt = require('express-jwt');

const corsOptions = {
   origin: "http://localhost:3000"
};

app.use(cors(corsOptions));
      

app.use(logger('dev'));
app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());


app.get("/", (req, res) => {
  res.json({ message: "Welcome to zhichi." });
});


require('./helper/passport');
require('./routes/user')(app);
require('./routes/comment')(app);
require('./routes/ticket')(app);

app.use((req, res, next)  => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  next();
});

const PORT = parseInt(process.env.PORT, 10) || 3000;
app.listen(PORT, (err) => {
  if (err) {
    console.error(`Error starting the app:${err}`)
  }
  console.info(`The server is running on localhost PORT: ${PORT}`);
});

module.exports = app;
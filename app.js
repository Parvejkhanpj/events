const express = require('express');
const app = express();
const  mongoose = require('mongoose');
require('dotenv').config()
const bodyParser = require('body-parser')
let port = 8080

app.use(bodyParser.json());
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  
  })
  .then(() => {
    console.log("DB Connected");
  });


app.listen(port, () => {
    console.log(`server listening on ${port}`)
})
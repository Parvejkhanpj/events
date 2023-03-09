const express = require('express');
const app = express();
const  mongoose = require('mongoose');
require('dotenv').config()
const bodyParser = require('body-parser')
let port = 8080

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connected");
  });


  // router 
  const UserRouter = require('./routes/user')


  app.use('/api', UserRouter)


  process.on("unhandled-rejection", (err) => {
    console.log(`An error occurred: ${err.message}`);
    server.close(() => process.exit(1));
  });
  
app.listen(port, () => {
    console.log(`server listening on ${port}`)
})
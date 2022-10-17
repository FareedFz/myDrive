
const bodyParser		= require('body-parser');
const express = require('express');
const router=require('./appRouter');


const app =express()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/',router);

app.listen(8000,()=>{
  console.log("running on port on 8000" );
});


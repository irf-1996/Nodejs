const express=require('express');
const app=express()
app.use(express.json());
require('dotenv').config();
const routerfile=require('./routes/basics');
app.use('/api',routerfile);
const port=process.env.port;
app.listen(port,()=>{
    console.log(`server is running in ${port}`);
})


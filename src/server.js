const { response } = require('express');
const express = require ('express');
const { v4 } = require("uuid");
const app = express();

app.use(express.json());

app.post('/users', (request, response)=>{
    const todoList = []
})


app.listen(5002, ()=>{
    console.log('🟢 Server started on PORT 5002')
})

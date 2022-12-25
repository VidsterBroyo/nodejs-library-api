// npm libraries
const fsP = require('fs').promises
const bodyParser = require('body-parser')
const multer = require('multer')
const upload = multer()

// express library setup
const express = require('express')
const app = express()
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies
app.use("/static", express.static('./static/'))

// set ddb libraries
var AWS = require('aws-sdk')
AWS.config.update({region: 'ca-central-1'})
var ddb = new AWS.DynamoDB.DocumentClient

const PORT = process.env.PORT || 5000


// home page
app.get('/', async (req, res) => { 
    // read from index.html file
    let data = await fsP.readFile('./index.html')

    // send html
    res.writeHead(200, {'Content-Type': 'text/html'}).end(data)
})


// get request
app.get('/getBooks', async (req, res) => { 
    // define ddb parameters
    var params = {TableName: 'bookShelfDB'}

    // set CORS permissions
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    try{
        // read from ddb table
        let data = await ddb.scan(params).promise()

        // send json
        res.setHeader('content-type', 'application/json')
        res.json(data)
        res.end()
    } catch (error) {
        res.end("getBooks response error: "+error)
    }
})


// new book (post) request
app.post('/postReq', upload.none(), async(req, res) => {

    // define ddb parameters
    var params = {
        TableName: 'bookShelfDB',
        Item: {
          'title' : req.body.title,
          'author' : req.body.author,
          'cover' : req.body.cover,
          'rating' : req.body.rating
        }
      }
    
    // add book to ddb table
    data = await ddb.put(params).promise()

    // refresh page
    res.redirect('/')
})


// updating rating (put) request
app.put('/putReq/:author/:title/:rating', async (req, res) => {
    
    // define ddb parameters
    const params = {
        TableName: "bookShelfDB",
        Key: {
            "title": req.params.title,
            "author": req.params.author
        },
        UpdateExpression: "set rating = :x",
        ExpressionAttributeValues: { ":x": req.params.rating }
    }

    // update rating on ddb table
    await ddb.update(params).promise()

    // refresh page
    res.redirect('/')
})


// delete request
app.delete('/delReq/:title/:author', async (req, res) => {

    // define ddb parameters
    const params = {
        TableName: 'bookShelfDB',
        Key: {
            "title": req.params.title,
            "author": req.params.author
        }
    }

    // delete book on ddb table
    await ddb.delete(params).promise()

    // refresh page
    res.redirect('/')
})


// open port
app.listen(PORT, (req, res) => console.log(`Port ${PORT} Opened`))
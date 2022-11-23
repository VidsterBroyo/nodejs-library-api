// npm libraries
const fsP = require('fs').promises

const bodyParser = require('body-parser')
const multer = require('multer')
const upload = multer()
const express = require('express')
const app = express()
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies
app.use("/static", express.static('./static/'))

var AWS = require('aws-sdk');
AWS.config.update({region: 'ca-central-1'});
var ddb = new AWS.DynamoDB.DocumentClient;

const PORT = process.env.PORT || 5000


// home page
app.get('/', async (req, res) => { 
    let data = await fsP.readFile('./index.html')
    res.writeHead(200, {'Content-Type': 'text/html'}).end(data)
})


// get request
app.get('/getBooks', async (req, res) => { 

    var params = {TableName: 'bookShelfDB'}

    let data = await ddb.scan(params).promise()
    res.json(data["Items"])
})


// post request
app.post('/postReq', upload.none(), async(req, res) => {

    var params = {
        TableName: 'bookShelfDB',
        Item: {
          'title' : req.body.title,
          'author' : req.body.author,
          'cover' : req.body.cover,
          'rating' : req.body.rating
        }
      }
    
    data = await ddb.put(params).promise()
    res.redirect('/')
})


// put request (updating rating)
app.put('/putReq/:author/:title/:rating', async (req, res) => {

    const params = {
        TableName: "bookShelfDB",
        Key: {
            "title": req.params.title,
            "author": req.params.author
        },
        UpdateExpression: "set rating = :x",
        ExpressionAttributeValues: { ":x": req.params.rating }
    }

    await ddb.update(params).promise()
    res.redirect('/')
})


// delete request
app.delete('/delReq/:title/:author', async (req, res) => {
    const params = {
        TableName: 'bookShelfDB',
        Key: {
            "title": req.params.title,
            "author": req.params.author
        }
    }

    await ddb.delete(params).promise()
    res.end()
})


// open port
app.listen(PORT, (req, res) => console.log(`Port ${PORT} Opened`))
// npm libraries
const fs = require('fs')
const express = require('express')
const app = express()
const PORT = 8000
const multer = require('multer')
const upload = multer()
const bodyParser = require('body-parser')
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies
app.use("/static", express.static('./static/'))


// home page
app.get('/', (req, res) => { 
    res.writeHead(200, {'Content-Type': 'text/html'})
    fs.readFile('./index.html', (err, data) => res.end(data))
})


// get request
app.get('/getBooks', (req, res) => { 
    fs.readFile('./books.json', (err, data) => res.writeHead(200, {'Content-Type': 'application/json'}).end(data))
})


// post request
// (using upload.none() because there's only text content)
app.post('/postReq', upload.none(), (req, res) => {

    // open json, turn json to an array, add new book to array, write array to file in JSON format
    fs.readFile('./books.json', (err, data) => {
        bookArray = JSON.parse(data)
        bookArray.push({"title":req.body.title, "author":req.body.author, "rating":parseInt(req.body.rating), "cover":req.body.cover})
        fs.writeFile('books.json', JSON.stringify(bookArray), (err) => res.redirect('/'))
    })
})


// put request (updating rating)
app.put('/putReq/:title/:rating', (req, res) => {

    // open json, turn json to an array, find book in array, change rating, write array to file in JSON format
    fs.readFile('./books.json', (err, data) => {
        bookArray = JSON.parse(data)

        for (let i = 0; i < bookArray.length; i++) {
            if (bookArray[i].title == req.params.title) {
                bookArray[i].rating = req.params.rating
            }
        }
        
        fs.writeFile('books.json', JSON.stringify(bookArray), (err) => res.end())
    })
})


// delete request
app.delete('/delReq/:title', (req, res) => {
    delTitle = req.params.title

    // open json, turn json to an array, find book in array, delete book, write array to file in JSON format
    fs.readFile('./books.json', (err, data) => {
        bookArray = JSON.parse(data)
        for(let i = 0; i < bookArray.length; i++){
            if(bookArray[i].title == delTitle){
                bookArray.splice(i, 1)
                break
            }
        }
        fs.writeFile('books.json', JSON.stringify(bookArray), (err) => res.end())
    })
    
})


// open port
app.listen(PORT, (req, res) => console.log(`Port ${PORT} Opened`))
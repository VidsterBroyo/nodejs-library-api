// variables to save which book's rating should be changed
let changeRatingTitle
let changeRatingAuthor


// loading all books into the html
function loadBooks(){
    try{
        // send getBooks request
        var request = new XMLHttpRequest()
        request.open('GET', 'http://localhost:5000/getBooks', false)
        request.send()

        // save list of book objects
        books = JSON.parse(request.responseText)["Items"]
        
        // loop through books
        for(x in books){
            // if loop has reached 4 books, make a new row
            if(x % 4 == 0){
                document.getElementById("bookGrid").innerHTML += `<div class="row mb-5" id="bookRow${x/4}"></div>`
            }

            // html code for the new book card
            newCard = `
            <div class="col-3" class="card">
                <img src="${books[x].cover}" class="card-img-top" style="object-fit: cover; width: 100%; height:75%;" alt="book cover">
                <div class="card-body">
                    <h5 class="card-title">${books[x].title}</h5>
                    <p class="author">${books[x].author}</p>
                    <p class="card-text">${"⭐".repeat(books[x].rating)}</p>
                    <button id="${books[x].title + "\\" + books[x].author}" onclick="setBookChange(this.id)" class="btn change-btn" data-bs-toggle="modal" data-bs-target="#changeRating">Change Rating</button>
                    <button id="${books[x].title + "\\" + books[x].author}" onclick="deleteBook(this.id)" class="btn delete-btn">Delete</button>
                </div>
            </div>
        `
            // add html to book row
            document.getElementById(`bookRow${Math.floor(x/4)}`).innerHTML += newCard   
        }
    } catch (error) {
        console.error("loadBooks() error: " + error)
    }
}


// delete book
function deleteBook(titleAuthor){
    // split the title from the author
    let title = titleAuthor.split("\\")[0]
    let author = titleAuthor.split("\\")[1]
    
    // send request to delete book
    var request = new XMLHttpRequest()
    request.open('DELETE', `http://localhost:5000/delReq/${title}/${author}`, false)
    request.send()

    // reload page
    location.reload()
}


// set change variables to book title and author so when changeRating() runs, it knows which book to change
function setBookChange(titleAuthor){
    changeRatingTitle = titleAuthor.split("\\")[0]
    changeRatingAuthor = titleAuthor.split("\\")[1]
}


// change rating
function changeRating(){
    // get rating from form
    var newRating = document.getElementById("newRating").value

    // send change rating request
    var request = new XMLHttpRequest()
    request.open('PUT', `http://localhost:5000/putReq/${changeRatingAuthor}/${changeRatingTitle}/${newRating}`, false)
    request.send()

    // reload page
    location.reload()
}
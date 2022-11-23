let changeRatingTitle
let changeRatingAuthor

function loadBooks(){

    var request = new XMLHttpRequest()

    request.open('GET', 'http://localhost:5000/getBooks', false)
    request.send()

    books = JSON.parse(request.responseText)
    console.log(books)

    for(x in books){
        if(x % 4 == 0){
            document.getElementById("bookGrid").innerHTML += `<div class="row mb-5" id="bookRow${x/4}"></div>`
        }

        newCard = `
        <div class="col-3" class="card">
            <img src="${books[x]['cover']}" class="card-img-top" style="object-fit: cover; width: 100%; height:75%;" alt="book cover">
            <div class="card-body">
                <h5 class="card-title">${books[x]['title']}</h5>
                <p class="author">${books[x]['author']}</p>
                <p class="card-text">${"⭐".repeat(books[x]['rating'])}</p>
                <button id="${books[x]['title'] + "\\" + books[x]['author']}" onclick="setBookChange(this.id)" class="btn change-btn" data-bs-toggle="modal" data-bs-target="#changeRating">Change Rating</button>
                <button id="${books[x]['title'] + "\\" + books[x]['author']}" onclick="deleteBook(this.id)" class="btn delete-btn">Delete</button>
            </div>
        </div>
      `

        document.getElementById(`bookRow${Math.floor(x/4)}`).innerHTML += newCard   
    }
}

function deleteBook(titleAuthor){
    let title = titleAuthor.split("\\")[0]
    let author = titleAuthor.split("\\")[1]
    
    var request = new XMLHttpRequest()
    request.open('DELETE', `http://localhost:5000/delReq/${title}/${author}`, false)
    request.send()
    location.reload()
}

function setBookChange(titleAuthor){
    changeRatingTitle = titleAuthor.split("\\")[0]
    changeRatingAuthor = titleAuthor.split("\\")[1]
}

function changeRating(){
    var request = new XMLHttpRequest()

    var newRating = document.getElementById("newRating").value

    request.open('PUT', `http://localhost:5000/putReq/${changeRatingAuthor}/${changeRatingTitle}/${newRating}`, false)
    request.send()
    location.reload()
}

loadBooks()
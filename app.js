const express = require('express')
const { connectToDb, getDb } = require('./db')
const { ObjectId } = require('mongodb')
const cors = require('cors')

//app initializing & middleware
const app = express()
app.use(cors()) //to allow other origin to access the endpoints
app.use(express.json()) //to use body from post request


let PORT = process.env.PORT || 9000
//dbConnection
let db
connectToDb( err => {
    if(!err) {
        app.listen(PORT, (req, res) => {
            console.log("server started at port no: 9000")
        })
        db = getDb()
    }
})

//routing
//pagination
app.get('/books', (req, res) => {
    const pageNumber = req.query.p || 0
    const booksPerPage = 3

    let books = []

    db.collection('books')
    .find()
    .sort({author: 1})
    .skip(pageNumber * booksPerPage)
    .limit(booksPerPage)
    .forEach(book => books.push(book))
    .then( ()=> {
        res.status(200).json(books)
    })
    .catch(err => {
        res.status(500).json({error: 'Not able to fetch the books from the database.'})
    })
})

app.get('/books/:id', (req, res) => {
    if(ObjectId.isValid(req.params.id)) {
        db.collection('books')
        .findOne({_id: new ObjectId(req.params.id)})
        .then( book => {
            if(book === null) res.status(404).json({error: 'book not found'})
            res.status(200).json(book)
        })
        .catch(err => {
            res.status(500).json({error: 'Cannot find the book'})
        })
    } else {
        res.status(500).json({error: 'Invalid book id'})
    }
})

app.post('/books', (req, res) => {
    const book = req.body

    db.collection('books')
    .insertOne(book)
    .then(response => {
        res.status(200).json(response)
    })
    .catch(err => {
        res.status(500).json({error: 'could not create a new document'})
    })
})


app.delete('/books/:id', (req, res) => {
    if(ObjectId.isValid(req.params.id)) {
        db.collection('books')
        .deleteOne({_id: new ObjectId(req.params.id)})
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({error: 'cannot delete the books'})
        })
    } else {
        res.status(500).json({error: 'Invalid book id'})
    }
})


app.patch('/books/:id', (req, res) => {
    if(ObjectId.isValid(req.params.id)) {
        const updates = req.body

        db.collection('books')
        .updateOne({_id: new ObjectId(req.params.id)}, {$set: updates})
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({error: 'cannot be updated'})
        })
    } else {
        res.status(500).json({error: 'Invalid Book Id'})
    }
})

//to fetch all the books belangs to the author
app.get('/books/author/:authName', (req, res) => {

    let books = []

    db.collection('books')
    .find({author: req.params.authName})
    .forEach(book => books.push(book))
    .then(() => {
        res.status(200).json(books)
    })
    .catch(err => {
        res.status(500).json({error: 'Not able to fetcc the books'})
    })
})
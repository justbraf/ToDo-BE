import express from 'express'
import cors from 'cors'
import { PORT, MongoDBURL } from './config.js'
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb"
const app = express()

app.use(express.json())
app.use(cors())

const client = new MongoClient(MongoDBURL, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const todosDB = client.db("myToDo")
const myTodos = todosDB.collection("ToDosCollection")

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})

// Add a task (max length 160 characters)
app.post('/add', (req, res) => {
    // get header data
    // validate task length 160 char
    // validate due date, if empty set next day
    // set public, if private not set

    return res.status(200).send("Hi")
})

// Delete a task
app.delete('/remove', (req, res) => {
    // get param id
    return res.status(200).send("Hi")
})

// update task
app.put('/update/:id', (req, res) => {
    return res.status(200).send("Hi")
})

// update options
app.put('/update/:id/:key', (req, res) => {
    return res.status(200).send("Hi")
})

// get all tasks
app.get('/tasks', (req, res) => {
    myTodos.find().toArray()
        .then(dbRes => {
            let msg = {}
            if (!dbRes.length)
                msg.message = "No tasks were found."
            else
                msg.data = dbRes
            return res.status(200).send(msg)
        })
        .catch(err => console.log(err))
})

// get a task by id
app.get('/task/:id', (req, res) => {
    const filter = {
        "_id": new ObjectId(req.params.id)
    }
    myTodos.findOne(filter)
        .then(dbRes => {
            let msg = {}
            if (!dbRes.length)
                msg.message = "No task was found."
            else
                msg.data = dbRes
            return res.status(200).send(msg)
        })
})
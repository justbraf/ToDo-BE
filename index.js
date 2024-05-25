import express from 'express'
import cors from 'cors'
import { PORT, MongoDBURL } from './config.js'
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb"
import { addDays, differenceInDays, format, subDays } from 'date-fns'
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
// Accepts task, dueDate, private, owner
app.post('/add', (req, res) => {
    // get header data
    const data = req.body

    if (!data.task)
        return res.status(200).send({ message: "No task found." })
    // validate task length 160 char
    if (data.task.length > 160)
        return res.status(200).send({ message: "Task has too many characters." })
    if (!data.owner)
        return res.status(200).send({ message: "No owner found." })
    // set public, if private not set
    if (!data.private)
        data.private = false
    // validate due date, if empty set next day
    if (!data.dueDate)
        data.dueDate = format(addDays(Date.now(), 1), "yyyy-MM-dd")
    // validate date format
    if (differenceInDays(new Date(data.dueDate), Date.now()) < 0)
        return res.status(200).send({ message: "Invalid date format, use: YYYY-MM-DD" })
    else {
        console.log("date: ", data.dueDate)
        console.log("diff: ", differenceInDays(new Date(data.dueDate), Date.now()))
        console.log("format: ", format(Date(data.dueDate), "yyyy-MM-dd"))
        data.dueDate = format(Date(data.dueDate), "yyyy-MM-dd")
    }
    
    // myTodos.insertOne(data)
    //     .then(dbRes => {
    //         let msg = {}
    //         if (!dbRes.insertedId)
    //             msg.message = "Oops! Something went wrong."
    //         else
    //             msg.message = "Added successfully."
    //         return res.status(201).send(msg)
    //     })
    //     .catch(err => {
    //         console.log(err)
    //         return res.status(201).send({ message: "Oops! Something went wrong." })
    //     })
    return res.status(201).send(data)
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
        .catch(err => {
            console.log(err)
            return res.status(201).send({ message: "Oops! Something went wrong." })
        })
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
        .catch(err => {
            console.log(err)
            return res.status(201).send({ message: "Oops! Something went wrong." })
        })
})
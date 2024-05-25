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
    else
        data.dueDate = format(new Date(data.dueDate), "yyyy-MM-dd")

    myTodos.insertOne(data)
        .then(dbRes => {
            let msg = {}
            if (!dbRes.insertedId)
                msg.message = "Oops! Something went wrong."
            else
                msg.message = "Added successfully."
            return res.status(201).send(msg)
        })
        .catch(err => {
            console.log(err)
            return res.status(500).send({ message: "Oops! Something went wrong." })
        })
})

// Delete a task
app.delete('/remove/:id', (req, res) => {
    // get param id
    const data = req.params

    const filter = {
        "_id": new ObjectId(data.id)
    }

    myTodos.deleteOne(filter)
        .then(dbRes => {
            let msg = {}
            if (!dbRes.deletedCount)
                msg.message = "Oops! Something went wrong."
            else
                msg.message = "Deleted sucessfully."
            return res.status(200).send(msg)
        })
        .catch(err => {
            console.log(err)
            return res.status(500).send({ message: "Oops! Something went wrong." })
        })
})

// update task
app.put('/update/:id', (req, res) => {
    const docData = req.body

    // Hanlde no fields detected
    if (!docData)
        return res.status(500).send({ message: "Oops! Something went wrong." })

    const filter = {
        "_id": new ObjectId(req.params.id)
    }

    const updDoc = {
        $set: {
            ...docData
        }
    }

    myTodos.updateOne(filter, updDoc)
        .then(dbRes => {
            let msg = {}
            console.log(dbRes)
            if (!dbRes.matchedCount || !dbRes.modifiedCount)
                msg.message = "Oops! Something went wrong."
            else
                msg.message = "Update sucessful."
            return res.status(200).send(msg)
        })
        .catch(err => {
            console.log(err)
            return res.status(500).send({ message: "Oops! Something went wrong." })
        })
})

// get all tasks
app.get('/tasks', (req, res) => {
    myTodos.find().toArray()
        .then(dbRes => {
            let msg = {}
            if (!dbRes.length)
                msg.message = "No tasks were found."
            else
                msg = dbRes
            return res.status(200).send(msg)
        })
        .catch(err => {
            console.log(err)
            return res.status(500).send({ message: "Oops! Something went wrong." })
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
            console.log(dbRes, !dbRes)
            if (!dbRes)
                msg.message = "No task was found."
            else
                msg = dbRes
            return res.status(200).send(msg)
        })
        .catch(err => {
            console.log(err)
            return res.status(500).send({ message: "Oops! Something went wrong." })
        })
})

// Error handling for bad URLs
app.get('*', (req, res) => {
    return res.status(500).send({ message: "Oops! Something went wrong." })
})
app.post('*', (req, res) => {
    return res.status(500).send({ message: "Oops! Something went wrong." })
})
app.delete('*', (req, res) => {
    return res.status(500).send({ message: "Oops! Something went wrong." })
})
app.put('*', (req, res) => {
    return res.status(500).send({ message: "Oops! Something went wrong." })
})
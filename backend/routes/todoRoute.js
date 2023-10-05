import express, { request, response } from 'express';
import { Todo } from '../models/todoModels.js';

const router = express.Router();

// Route for getting all todo items
router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find(); // Retrieve all todos from the database
        res.json(todos); // Send the todos as a JSON response
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route for posting todo items
router.post('/', async (req, res) => {
    console.log(req.body);
    try {

        if (!req.body.title)
        {
            return res.status(400).send({
                message: 'Send all required fields : title, isChecked',
            });            
        }

        const { title, isChecked } = req.body;

        // Create a new todo instance
        const newTodo = new Todo({
            title,
            isChecked
        });

        // Save the todo to the database
        await newTodo.save();

        res.status(201).json(newTodo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
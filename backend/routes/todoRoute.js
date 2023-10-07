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

// Update isChecked and other properties for a specific todo item
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, isChecked } = req.body;

        // Find the todo item by ID
        const updatedTodo = await Todo.findByIdAndUpdate(
            id,
            { title, isChecked },
            { new: true }
        );
          
        if (!updatedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
          
        res.json(updatedTodo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route for deleting a todo item
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find the todo item by ID and delete it
        const todo = await Todo.findByIdAndDelete(id);

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
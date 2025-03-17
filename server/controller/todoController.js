import Todo from '../models/todo.js'

export const CreateTodos = async (req, res) => {
    const { title, description } = req.body;
    try {
        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required fields'
            });
        }
        // Check if todo already exists with same title
        const existingTodo = await Todo.findOne({ title });
        if (existingTodo) {
            return res.status(400).json({
                success: false,
                message: 'Todo already exists with same name use a different todo title.'
            });
        }
        const todo = new Todo({
            title,
            description
        })
        await todo.save();

        return res.status(201).json({
            success: true,
            message: 'Todo created successfully'
        })
    } catch (error) {
        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                message: 'Something went wrong',
                error: error.message
            });
        }
    }
}

export const getTodo = async (req, res) => {
    try {
        const todo = await Todo.find();
        return res.status(200).json({
            success: true,
            message: "Fetched all todos successfully",
            todo
        })
    } catch (error) {
        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                message: 'Something went wrong',
                error: error.message
            });
        }
    }
}

export const DeleteTodo = async (req, res) => {
    const { id } = req.params;
    try {
        const delTodo = await Todo.findByIdAndDelete(id);
        if (!delTodo) {
            return res.status(404).json({
                success: false,
                message: "Todo not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Todo deleted successfully"
        });

    } catch (error) {
        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                message: 'Something went wrong',
                error: error.message
            });
        }
    }
};

export const updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        // Ensure there is data to update
        if (!title && !description) {
            return res.status(400).json({
                success: false,
                message: "Please provide title or description to update"
            });
        }
        const newTodo = await Todo.findByIdAndUpdate(id, req.body, { new: true });

        if (!newTodo) {
            return res.status(404).json({
                success: false,
                message: "Todo not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Todo updated successfully",
            todo: newTodo
        });
    } catch (error) {
        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                message: "Something went wrong",
                error: error.message
            });
        }
    }
};


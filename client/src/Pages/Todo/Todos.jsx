import React, { useState, useEffect } from 'react';

const Todos = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState({ title: '', description: '' });
    const [showModal, setShowModal] = useState(false);
    const [currentTodo, setCurrentTodo] = useState({ id: '', title: '', description: '' });

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/auth/get-todo`);
            const data = await response.json();
            setTodos(data.todo);
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    };

    const handleAddTodo = async () => {
        if (!newTodo.title || !newTodo.description) return;
        try {
            await fetch(`http://localhost:8000/api/auth/create-todo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${JSON.parse(localStorage.getItem('auth'))}`
                },
                body: JSON.stringify(newTodo),
            });
            fetchTodos();
            setNewTodo({ title: '', description: '' });
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    };

    const openUpdateModal = (todo) => {
        setCurrentTodo({
            id: todo._id,
            title: todo.title,
            description: todo.description
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setCurrentTodo({
            ...currentTodo,
            [name]: value
        });
    };

    const updateTodo = async () => {
        try {
            const res = await fetch(`http://localhost:8000/api/auth/update-todo/${currentTodo.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${JSON.parse(localStorage.getItem('auth'))}`
                },
                body: JSON.stringify({
                    title: currentTodo.title,
                    description: currentTodo.description,
                }),
            });
            fetchTodos();
            setShowModal(false);
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`http://localhost:8000/api/auth/delete-todo/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${JSON.parse(localStorage.getItem('auth'))}`
                },
            });
            fetchTodos();
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-black to-red-700 p-4">
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Update Todo</h3>
                        <div className="flex flex-col gap-4">
                            <input
                                type="text"
                                name="title"
                                value={currentTodo.title}
                                onChange={handleUpdateChange}
                                placeholder="Title"
                                className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                            />
                            <textarea
                                name="description"
                                value={currentTodo.description}
                                onChange={handleUpdateChange}
                                placeholder="Description"
                                className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                            />
                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    onClick={closeModal}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={updateTodo}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Todo List</h2>

                <div className="flex flex-col gap-4 mb-6">
                    <input
                        type="text"
                        value={newTodo.title}
                        onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                        placeholder="Todo Title"
                        className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                    />
                    <textarea
                        value={newTodo.description}
                        onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                        placeholder="Todo Description"
                        className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                    />
                    <button
                        onClick={handleAddTodo}
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
                    >
                        Add
                    </button>
                </div>

                <ul className="space-y-4">
                    {todos.map((todo) => (
                        <li
                            key={todo._id}
                            className="flex flex-col p-4 bg-gray-100 rounded-lg shadow"
                        >
                            <div className="mb-4">
                                <h3
                                    className={`text-xl font-semibold ${todo.completed
                                        ? 'line-through text-gray-500'
                                        : 'text-gray-800'
                                        }`}
                                >
                                    {todo.title}
                                </h3>
                                <p
                                    className={`mt-2 ${todo.completed
                                        ? 'line-through text-gray-400'
                                        : 'text-gray-600'
                                        }`}
                                >
                                    {todo.description}
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => openUpdateModal(todo)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                                >
                                    Update
                                </button>
                                <button
                                    onClick={() => handleDelete(todo._id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}

                    {todos.length === 0 && (
                        <p className="text-center text-gray-500">No tasks yet. Add some!</p>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Todos;
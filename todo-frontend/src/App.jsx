import React, { useState, useEffect } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./App.css";

const API_URL = "http://localhost:3001/todos";

function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedText, setEditedText] = useState("");

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (storedTasks && storedTasks.length > 0) {
      setTasks(storedTasks);
    } else {
      axios.get(API_URL).then((res) => {
        setTasks(res.data);
        localStorage.setItem("tasks", JSON.stringify(res.data));
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = async () => {
    if (!text.trim()) return;
    const res = await axios.post(API_URL, { text });
    setTasks([...tasks, res.data]);
    setText("");
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleComplete = async (id, completed) => {
    await axios.patch(`${API_URL}/${id}`, { completed });
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed } : task)));
  };

  const startEditing = (id, text) => {
    setEditingId(id);
    setEditedText(text);
  };

  const saveEdit = async (id) => {
    if (!editedText.trim()) return;
    await axios.patch(`${API_URL}/${id}/edit`, { text: editedText });
    setTasks(tasks.map((task) => (task.id === id ? { ...task, text: editedText } : task)));
    setEditingId(null);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedTasks = [...tasks];
    const [movedTask] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, movedTask);
    setTasks(reorderedTasks);
  };

  return (
    <div className="app">
      <h1>To-Do List</h1>
      <div className="input-container">
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter a task" />
        <button onClick={addTask}>Add</button>
      </div>

      {tasks.length === 0 ? (
        <p>No tasks to display</p>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <ul {...provided.droppableProps} ref={provided.innerRef}>
                {tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                    {(provided) => (
                      <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={task.completed ? "completed" : ""}>
                        <input type="checkbox" checked={task.completed} onChange={() => toggleComplete(task.id, !task.completed)} />

                        {editingId === task.id ? (
                          <>
                            <input type="text" value={editedText} onChange={(e) => setEditedText(e.target.value)} />
                            <button onClick={() => saveEdit(task.id)}>Save</button>
                          </>
                        ) : (
                          <>
                            <span>{task.text}</span>
                            <button onClick={() => startEditing(task.id, task.text)}>Edit</button>
                            <button onClick={() => deleteTask(task.id)}>Delete</button>
                          </>
                        )}
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
}

export default App;

import React, { useEffect, useState } from "react";

//include images into your bundle
import rigoImage from "../../img/rigo-baby.jpg";

//create your first component
function TodoItem({ label, is_done, delete_todo, toggle_todo }) {
  return (
    <div className="todo-item">
      <input type="checkbox" checked={is_done} onChange={toggle_todo} />
      <span className="todo-text" onClick={toggle_todo}>
        {label}
      </span>
      <div className="btn btn-danger" onClick={delete_todo}>
        Delete
      </div>
    </div>
  );
}

const Home = () => {
  const [todos, setTodos] = useState([]);
  const [todoInput, setTodoInput] = useState("");
  const [user, setUser] = useState("KimO.");
  const [isLoading, setIsLoading] = useState(false);

  //API URL
  const API_BASE_URL = "https://playground.4geeks.com/todo";

  useEffect(() => {
    console.log("on mount useEffect");
    const local_todos = localStorage.getItem("todos");
    if (local_todos) {
      setTodos(JSON.parse(local_todos));
    }
  }, []);

  useEffect(() => {
    console.log("on change useEffect");
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleApiError = async (responce) => {
    if (!responce.ok) {
      const errorText = await responce.text();
      throw new error("API error: ${responce.status} - ${errorText}");
    }
  };

  const intializeUser = async () => {
    const response = await fetch("${API_BASE_URL}/users/${user}", {
      method: "GET",
      headers: {
        "Content-Type": "application.json",
      },
    });
    if (response.ok) {
      const data = await response.json();
      setTodos(data.todos);
    } else {
      const responce = await fetch("${API_BASE_URL}/users/${user}", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    const fetchTodos = async () => {
      const responce = await fetch("${API_BASE_URL}/users/${user}", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      await handleApiError(response);
      const data = await response.json();
      setTodos(Array.isArray(data) ? data : []);
      setIsLoading(false);
    };
  };

  const handClick = async () => {
    const url = "https://playground.4geeks.com/todo/todos/KimO.";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        label: newTodo,
        is_done: false,
      }),
    });
    const data = await response.json();
    setTodos([data, ...todos]);
    setNewTodo("");
  };

  const handleChange = (event) => {
    setNewTodo(event.target.value);
  };

  const deleteTask = async (id) => {
    const url = "https://playground.4geeks.com/todo/todos/${id}";
    const response = await fetch(url, {
      method: "DELETE",
    });
    console.log(id);
    const newList = todos.filter((todo) => todo.id !== id);
    setTodos(newList);
  };

  return (
    <>
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          if (todoInput.length > 0) {
            setTodos([
              {
                label: todoInput,
                is_done: false,
              },
              ...todos,
            ]);
            setTodoInput("");
          }
        }}
        className="container d-flex flex-column align-items-center justify-content-center"
      >
        <h1>Todo List</h1>
        <input
          class="form-control form-control-lg"
          type="text"
          placeholder="New Task!!"
          aria-label="todolist Input field"
          value={todoInput}
          onChange={(ev) => setTodoInput(ev.target.value)}
        ></input>
        <button className="btn btn-lg btn-primary col-2" onclick={handClick}>
          Add to List
        </button>
        <h3> New Task: {todoInput}</h3>
        {/* <ul className="list-group-item d-flex justify-content-between align-items-center">
          {todo.label}
          <button
            className="m-3 btn btn-danger"
            onClick={() => deleteTask(todo.id)}
          >
            Delete
          </button>
        </ul> */}
        {todos.map((item, idx) => (
          <TodoItem
            key={idx}
            label={item.label}
            is_done={item.is_done}
            toggle_todo={() =>
              setTodos(
                todos.toSpliced(idx, 1, {
                  label: item.label,
                  is_done: !item.is_done,
                })
              )
            }
            delete_todo={() => {
              setTodos(todos.toSpliced(idx, 1));
              localStorage.setItem(
                "todos",
                JSON.stringify(todos.toSpliced(idx, 1))
              );
            }}
          />
        ))}
        <small>
          {todos.filter((item) => item.is_done).length} todos left to do!!
        </small>
      </form>
    </>
  );
};

export default Home;

const { response, request } = require("express");
const express = require("express");
const { v4 } = require("uuid");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

//    |MIDDLEWARE|
function checkIfExistsUser(request, response, next) {
  const { username } = request.headers;
  const user = users.find((user) => user.username === username);

  if (!user) {
    return response.status(404).json({ error: "User not found" });
  }
  request.user = user;
  return next();
}

app.post("/users", (request, response) => {
  const { name, username } = request.body;

  const userExists = users.find((user) => user.username === username);

  if (userExists) {
    return response.status(404).json({ error: "User already exists" });
  }
  const user = {
    id: v4(),
    name,
    username,
    todos: [],
  };
  users.push(user);

  return response.status(201).json(user);
});

app.get("/todos", checkIfExistsUser, (request, response) => {
  const { user } = request;
  return response.json(user.todos);
});

app.post("/todos", (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;

  const todo = {
    id: v4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  user.todos.push(todo);

  return response.status(201).json(todo);
});

app.put("/todos/:id", (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;
  const { id } = request.params;

  user.todos.find((todo) => todo.id === id);
  if (!todo) {
    return response.status(404).json({ error: "User not found" });
  }

  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.json(todo);
});

app.patch("todos/:id/done", (request, response) => {
  const { user } = request;
  const { id } = request.params;

  user.todos.find((todo) => todo.id === id);
  if (!todo) {
    return response.status(404).json({ error: "User not found" });
  }
  todo.done = true;

  return response.json(todo);
});

app.delete('/todos/:id', (request, response)=>{
  const { user } = request;
  const { id } = request.params;

  const todoIndex = user.todos.findIndex((todo) => todo.id === id);

  if (todoIndex === -1) {
    return response.status(404).json({ error: "User not found" });
  }
  user.todos.splice(todoIndex);

  return response.status(204).send.json();

})

app.listen(5002, () => {
  console.log("🟢 Server started on PORT 5002");
});

import React, {Component} from 'react';
import './App.css';
import TodoContainer from './Components/TodoContainer'
import TodoForm from './Components/TodoForm'
import SignUpForm from './Components/SignUpForm';
const todoURL = "http://localhost:3000/todos/" 

class App extends Component {
  
  state = {
    todos: [],
    user: {},
    alerts: []
  }


  componentDidMount() {
    this.getTodos()
  }

  getTodos = () => {
    fetch(todoURL)
      .then(response => response.json())
      .then(todos => this.setState({todos}))
  }

  addTodo = (newTodo) => {
    this.setState({
      todos: [...this.state.todos, newTodo]
    })

    fetch(todoURL, {
      method: "POST",
      headers: {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify({todo: newTodo})
    })
  }

  updateTodo = (updatedTodo) => {
    let todos = this.state.todos.map(todo => todo.id === updatedTodo.id ? updatedTodo : todo)
    this.setState({todos})

    fetch(todoURL + "/" + updatedTodo.id, {
      method: "PATCH",
      headers: {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify({todo: updatedTodo})
    })
  }


  deleteTodo = (id) => {
    let filtered =  this.state.todos.filter(todo => todo.id !== id)
    this.setState({
      todos: filtered
    })
    fetch(todoURL +  id, { method: "DELETE" })
  }

  signUp = (user) => {
    fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
        },
      body: JSON.stringify({user})
    })
    .then(response => response.json())
    .then(response => {
      if(response.errors){
        this.setState({alerts: response.errors})
      }
      else {
        localStorage.setItem('token', response.token)
        this.setState({
          user: response.user,
          alerts: ["User successfully created!"]
        })
      }
    })
  }

  render(){
    return (
      <div className="App">
        <h1>Todo App</h1>
        <SignUpForm signUp={this.signUp} alerts={this.state.alerts}/>
        <TodoForm submitAction={this.addTodo}/>
        <TodoContainer updateTodo={this.updateTodo} deleteTodo={this.deleteTodo} todos={this.state.todos}/>
        
      </div>
    )
  }
}

export default App;

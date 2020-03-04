import React, { useState, useCallback, useRef, FormEvent, useEffect, memo } from "react";
import ReactDom from "react-dom";
import "./Todolist.scss";

let id = Date.now();

interface Todo {
  [key: string]: any;
}

interface ControlProps {
  addTodo: (todo: Todo) => void;
}

interface TodosProps {
  todos: Todo[];
  removeTodo: (id: number) => void;
  toggleTodo: (id: number) => void;
}

interface TodoProps {
  todo: Todo;
  removeTodo: (id: number) => void;
  toggleTodo: (id: number) => void;
}

const Control = memo(function Control(props: ControlProps) {
  const { addTodo } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newText = inputRef.current?.value.trim();
    if (newText?.length !== 0) {
      addTodo({
        id: id++,
        complete: false,
        text: newText,
      });
    }
  };
  return (
    <div className="control">
      <h1>todos</h1>
      <form onSubmit={onSubmit}>
        <input type="text" ref={inputRef} className="new-todo" placeholder="添加需要做的事情" />
      </form>
    </div>
  );
});

const Todos = memo(function Todos(props: TodosProps) {
  const { todos, removeTodo, toggleTodo } = props;
  return (
    <ul className="todos">
      {todos.map((todo: Todo) => {
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            toggleTodo={toggleTodo}
            removeTodo={removeTodo}
          ></TodoItem>
        );
      })}
    </ul>
  );
});

const TodoItem = memo(function TodoItem(props: TodoProps) {
  const {
    todo: { id, text, complete },
    removeTodo,
    toggleTodo,
  } = props;
  const onChange = () => {
    toggleTodo(id);
  };
  const onRemove = () => {
    removeTodo(id);
  };
  return (
    <li className="todo-item">
      <input type="checkbox" onChange={onChange} checked={complete} />
      <label htmlFor="" className={complete ? "complete" : ""}>
        {text}
      </label>
      <button onClick={onRemove}>&#xd7;</button>
    </li>
  );
});

const LS_KEY = "_todos";

function Todolist() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo: ControlProps["addTodo"] = (todo: Todo) => {
    setTodos((todos: Todo[]) => [...todos, todo]);
  };

  const removeTodo = useCallback((id: number) => {
    setTodos((todos: Todo[]) =>
      todos.filter((todo: Todo) => {
        return todo.id !== id;
      }),
    );
  }, []);

  const toggleTodo = useCallback((id: number) => {
    setTodos((todos: Todo[]) =>
      todos.map((todo: Todo) => {
        return todo.id === id ? { ...todo, complete: !todo.complete } : todo;
      }),
    );
  }, []);

  useEffect(() => {
    setTodos(JSON.parse(localStorage.getItem(LS_KEY) || "[]"));
  }, []);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(todos));
  }, [todos]);

  return (
    <div className="todo-list">
      <Control addTodo={addTodo}></Control>
      <Todos todos={todos} removeTodo={removeTodo} toggleTodo={toggleTodo}></Todos>
    </div>
  );
}

ReactDom.render(<Todolist />, document.getElementById("app"));

if ((module as any).hot) {
  (module as any).hot.accept();
}

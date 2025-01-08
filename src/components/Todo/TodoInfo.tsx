import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';
import { client } from '../../utils/fetchClient';

type Props = {
  todo: Todo;
  setTodos: (updater: (todos: Todo[]) => Todo[]) => void;
  setOriginalTodos: (updater: (todos: Todo[]) => Todo[]) => void;
  setError: (newError: string) => void;
};
export const TodoInfo: React.FC<Props> = ({
  todo,
  setTodos,
  setOriginalTodos,
  setError,
}) => {
  const changeComplited = () => {
    client
      .patch<Todo>(`/todos/${todo.id}`, { completed: !todo.completed })
      .then((changedTodo: Todo) => {
        setTodos((previous: Todo[]) =>
          previous.map((t: Todo) =>
            t.id === changedTodo.id ? changedTodo : t,
          ),
        );
        setOriginalTodos((previous: Todo[]) =>
          previous.map((t: Todo) =>
            t.id === changedTodo.id ? changedTodo : t,
          ),
        );
      })

      .catch(() => setError('cannot change todo'));
  };

  const deleteComplited = () => {
    client
      .delete(`/todos/${todo.id}`)
      .then(() => {
        setTodos((previous: Todo[]) =>
          previous.filter((t: Todo) => t.id !== todo.id),
        );
        setOriginalTodos((previous: Todo[]) =>
          previous.filter((t: Todo) => t.id !== todo.id),
        );
      })
      .catch(() => setError('cannot delete todo'));
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
  <div
    data-cy="Todo"
    className={classNames('todo', { completed: todo.completed })}
  >
    <label
      className="todo__status-label"
      htmlFor={`todo-${todo.id}`} // Связываем с input через htmlFor
    >
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        id={`todo-${todo.id}`} // Уникальный идентификатор для input
        checked={todo.completed}
        onChange={changeComplited}
      />
      <span className="visually-hidden">
        {todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
      </span>
    </label>

    <span data-cy="TodoTitle" className="todo__title">
      {todo.title}
    </span>

    <button
      type="button"
      className="todo__remove"
      data-cy="TodoDelete"
      onClick={deleteComplited}
    >
      ×
    </button>

    <div data-cy="TodoLoader" className="modal overlay">
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
</section>

  );
};

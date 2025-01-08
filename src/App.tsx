/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';
import { client } from './utils/fetchClient';
import { TodoInfo } from './components/Todo/TodoInfo';
import { Footer } from './components/Footer/Footer';
import { Errors } from './components/Errors/Errors';
import { Loader } from './components/Loader/Loader';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [originalTodos, setOriginalTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    client
      .get<Todo[]>(`/todos?userId=${USER_ID}`)
      .then(fetchedTodos => {
        setTodos(fetchedTodos);
        setOriginalTodos(fetchedTodos);
      })
      .catch(() => setError('Unable to load todos'))
      .finally(() => setIsLoading(false));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const onToggle = () => {
    const allCompleted = todos.every(todo => todo.completed);

    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: !allCompleted,
    }));

    setIsLoading(true);

    Promise.all(
      updatedTodos.map(todo =>
        client.patch(`/todos/${todo.id}`, { completed: todo.completed }),
      ),
    )
      .then(() => {
        setTodos(updatedTodos);
        setOriginalTodos(updatedTodos);
      })
      .catch(() => setError('cannot togle todos'))
      .finally(() => setIsLoading(false));
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const newTodo = {
      userId: USER_ID,
      title: query,
      completed: false,
    };

    setIsLoading(true);
    client
      .post<Todo>(`/todos`, newTodo)
      .then((createdTodo: Todo) => {
        setTodos(currentTodos => [...currentTodos, createdTodo]);
        setOriginalTodos(currentTodos => [...currentTodos, createdTodo]);
        setQuery('');
      })
      .catch(() => setError('cannot add todo'))
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: todos.every(todo => todo.completed),
            })}
            data-cy="ToggleAllButton"
            onClick={onToggle}
          />

          <form onSubmit={event => onSubmit(event)}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={query}
              onChange={event => setQuery(event.target.value)}
            />
          </form>
        </header>

        {isLoading ? (
          <Loader />
        ) : (
          todos.map(todo => (
            <TodoInfo
              setOriginalTodos={setOriginalTodos}
              todo={todo}
              setTodos={setTodos}
              setError={setError}
              key={todo.id}
            />
          ))
        )}
      </div>

      {originalTodos.length > 0 && (
        <Footer
          setTodos={setTodos}
          originalTodos={originalTodos}
          setOriginalTodos={setOriginalTodos}
        />
      )}

      <Errors error={error} setError={setError} />
    </div>
  );
};

import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import { client } from '../../utils/fetchClient';
import classNames from 'classnames';

type Props = {
  originalTodos: Todo[];
  setTodos: (updater: ((todos: Todo[]) => Todo[]) | Todo[]) => void;
  setOriginalTodos: (updater: ((todos: Todo[]) => Todo[]) | Todo[]) => void;
};

export const Footer: React.FC<Props> = ({
  originalTodos,
  setTodos,
  setOriginalTodos,
}) => {
  const [selectedSort, setSelectedSort] = useState('all');
  const isCompleted = originalTodos.some(todo => todo.completed);

  const appearAll = () => {
    setTodos(originalTodos);
    setSelectedSort('all');
  };

  const appearActive = () => {
    setTodos(originalTodos.filter(todo => todo.completed === false));
    setSelectedSort('active');
  };

  const appearCompleted = () => {
    setTodos(originalTodos.filter(todo => todo.completed === true));
    setSelectedSort('completed');
  };

  const clearCompleted = () => {
    originalTodos.forEach(todo => {
      if (todo.completed) {
        client.delete(`/todos/${todo.id}`).then(() => {
          setTodos(previous => previous.filter((t: Todo) => t.id !== todo.id));
          setOriginalTodos(previous =>
            previous.filter((t: Todo) => t.id !== todo.id),
          );
        });
      }
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${originalTodos.filter(todo => todo.completed === false).length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: selectedSort === 'all',
          })}
          data-cy="FilterLinkAll"
          onClick={appearAll}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: selectedSort === 'active',
          })}
          data-cy="FilterLinkActive"
          onClick={appearActive}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: selectedSort === 'completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={appearCompleted}
        >
          Completed
        </a>
      </nav>

      {isCompleted ? (
        <button
          type="button"
          className="todoapp__clear-completed visible"
          data-cy="ClearCompletedButton"
          onClick={clearCompleted}
        >
          Clear completed
        </button>
      ) : (
        <button className="todoapp__clear-completed" />
      )}
    </footer>
  );
};

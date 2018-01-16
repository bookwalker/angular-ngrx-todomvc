import {Action, Store} from '@ngrx/store';
import {Todo} from '../todo/todo.model';
import {Injectable} from '@angular/core';
import {AppState} from './store';


export interface TodoAction extends Action {
	type: string;
	payload: any;
}

@Injectable()
export class TodoActions {

	static readonly LOAD = 'LOAD';
	static readonly INITIAL_STATE = 'INITIAL_STATE';
	static readonly CREATE = 'CREATE';
	static readonly UPDATE = 'UPDATE';
	static readonly DELETE = 'DELETE';
	static readonly TOGGLE = 'TOGGLE';
	static readonly TOGGLE_ALL = 'TOGGLE_ALL';
	static readonly CLEAR_COMPLETED = 'CLEAR_COMPLETED';

	constructor(private store: Store<AppState>) {
	}

	static modifyingActions() {
		return [TodoActions.CREATE, TodoActions.UPDATE, TodoActions.DELETE,
			TodoActions.TOGGLE, TodoActions.TOGGLE_ALL,
			TodoActions.CLEAR_COMPLETED
		];
	}

	load() {
		this.store.dispatch({type: TodoActions.LOAD});
	}

	initialState(todos: Todo[]) {
		this.store.dispatch({type: TodoActions.INITIAL_STATE, payload: todos});
	}

	create(text: string) {
		this.store.dispatch({type: TodoActions.CREATE, payload: text});
	}

	update(todo: Todo) {
		this.store.dispatch({type: TodoActions.UPDATE, payload: todo});
	}

	delete(todo: Todo) {
		this.store.dispatch({type: TodoActions.DELETE, payload: todo});
	}

	toggle(todo: Todo) {
		this.store.dispatch({type: TodoActions.TOGGLE, payload: todo});
	}

	toggleAll(completed: boolean) {
		this.store.dispatch({type: TodoActions.TOGGLE_ALL, payload: completed});
	}

	clearCompleted() {
		this.store.dispatch({type: TodoActions.CLEAR_COMPLETED});
	}
}


import {Injectable} from '@angular/core';

import {Todo} from './todo/todo.model';

@Injectable()
export class TodoService {

	private static STORAGE_KEY = 'todos-angular-5-ngrx';

	constructor() {
	}

	fetch() {
		const persistedValue = localStorage.getItem(TodoService.STORAGE_KEY);
		try {
			return JSON.parse(persistedValue || '[]');
		} catch (ignore) {
			return [];
		}
	}

	save(todos: Todo[]): void {
		localStorage.setItem(TodoService.STORAGE_KEY, JSON.stringify(todos));
	}
}

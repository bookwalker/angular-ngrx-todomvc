import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/combineLatest';

import {Todo, TodoUtils} from './todo.model';
import {Filter, FilterUtil} from './filter.model';
import {TodoActions} from '../store/todo.actions';
import {AppState} from '../store/store';


@Component({
	selector: 'app-todo',
	templateUrl: './todo.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoComponent implements OnInit {

	todos$: Observable<Todo[]>;
	filter$: Observable<Filter>;
	total$: Observable<number>;
	remaining$: Observable<number>;
	completed$: Observable<number>;
	allCompleted$: Observable<boolean>;

	newTodo = '';
	currentTodo: Todo;
	editingTodo: Todo;


	constructor(private store: Store<AppState>, private todoActions: TodoActions) {
	}

	// ~ lifecycle

	ngOnInit() {
		this.todoActions.load();

		const allTodos$ = this.store.select('todos');
		this.filter$ = this.store.select('router')
			.map(router => router ? FilterUtil.fromString(router.state.params['filter']) : Filter.ALL);

		this.todos$ = allTodos$
			.combineLatest(this.filter$)
			.map(([todos, filter]) => todos.filter(t => FilterUtil.accepts(t, filter)));

		this.total$ = allTodos$.map((todos: Todo[]) => todos.length);
		this.remaining$ = allTodos$.map((todos: Todo[]) => todos.filter(t => !t.completed).length);

		this.completed$ = this.total$
			.combineLatest(this.remaining$)
			.map(([total, remaining]) => total - remaining);

		this.allCompleted$ = this.total$
			.combineLatest(this.remaining$)
			.map(([total, remaining]) => total > 0 && remaining === 0);
	}

	// ~ crud

	create(todo: string) {
		if (todo.trim().length === 0) {
			return;
		}
		this.todoActions.create(todo);
		this.newTodo = '';
	}

	edit(todo: Todo) {
		this.currentTodo = todo;
		this.editingTodo = TodoUtils.copy(todo);
	}

	cancelEdit() {
		this.currentTodo = null;
		this.editingTodo = null;
	}

	update(todo: Todo) {
		if (todo === null) {
			return;
		}
		this.todoActions.update(todo);
		this.currentTodo = null;
		this.editingTodo = null;
	}

	delete(todo: Todo) {
		this.todoActions.delete(todo);
	}

	toggle(todo: Todo) {
		this.todoActions.toggle(todo);
	}

	toggleAll(completed: boolean) {
		this.todoActions.toggleAll(completed);
	}

	clearCompleted() {
		this.todoActions.clearCompleted();
	}
}

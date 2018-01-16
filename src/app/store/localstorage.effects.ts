import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {Actions, Effect} from '@ngrx/effects';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';

import {TodoService} from '../todo.service';
import {AppState} from './store';
import {TodoActions} from './todo.actions';


@Injectable()
export class LocalStorageEffects {

	// @Effect({dispatch: false})
	// appInit$: Observable<any> = defer(() => {
	// 	console.log('init state');
	// 	const todos = this.todoService.fetch();
	// 	this.store.dispatch({type: 'INITIAL_STATE', payload: todos});
	// });

	@Effect()
	load$ = this.actions$.ofType('LOAD')
		.delay(1000)
		.map(() => {
			return {type: 'INITIAL_STATE', payload: this.todoService.fetch()};
		});

	@Effect({dispatch: false})
	autosave$ = this.actions$
		.ofType(...TodoActions.modifyingActions())
		.withLatestFrom(this.store.select('todos'))
		.map(([action, state]) => {
			this.todoService.save(state);
		});

	constructor(private store: Store<AppState>, private actions$: Actions, private todoService: TodoService) {
	}
}

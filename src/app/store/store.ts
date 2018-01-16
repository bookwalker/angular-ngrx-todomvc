import {Action, ActionReducer, ActionReducerMap, MetaReducer, State} from '@ngrx/store';
import {Params} from '@angular/router';
import {routerReducer, RouterReducerState} from '@ngrx/router-store';

import {Todo} from '../todo/todo.model';
import {todoReducer} from './todo.reducer';
import {environment} from '../../environments/environment';

export interface RouterStateUrl {
	url: string;
	params: Params;
	queryParams: Params;
}

export interface AppState {
	router: RouterReducerState<RouterStateUrl>;
	todos: Todo[];
}

export const rootReducerMap: ActionReducerMap<AppState, Action> = {
	router: routerReducer,
	todos: todoReducer
};

// console.log all actions
export function logger(reducer: ActionReducer<AppState, Action>): ActionReducer<AppState, Action> {
	return function(state: AppState, action: any): AppState {
		console.log('state', state);
		console.log('action', action);
		return reducer(state, action);
	};
}

/**
 * By default, @ngrx/store uses combineReducers with the reducer map to compose
 * the root meta-reducer. To add more meta-reducers, provide an array of meta-reducers
 * that will be composed to form the root meta-reducer.
 */
export const metaReducers: MetaReducer<AppState, Action>[] = !environment.production ? [logger] : [];

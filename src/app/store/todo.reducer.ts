import {Todo} from '../todo/todo.model';
import {TodoAction, TodoActions} from './todo.actions';


export const todoReducer = (state: Todo[] = [], action: TodoAction): Todo[] => {
	switch (action.type) {
		case TodoActions.INITIAL_STATE:
			return action.payload;

		case TodoActions.CREATE:
			let id = 1;
			if (state.length > 0) {
				id = state[state.length - 1].id + 1;
			}
			return [...state, new Todo(id, action.payload)];

		case TodoActions.UPDATE:
			if (action.payload.title.trim().length === 0) {
				return state.filter(t => t.id !== action.payload.id);
			}
			return state.map((t) => {
				if (action.payload.id === t.id) {
					return new Todo(action.payload.id, action.payload.title, action.payload.completed);
				}
				return t;
			});

		case TodoActions.DELETE:
			return state.filter((t) => {
				return action.payload.id !== t.id;
			});

		case TodoActions.TOGGLE:
			return state.map((t) => {
				if (action.payload.id === t.id) {
					return Object.assign({}, t, {completed: !t.completed});
				}
				return t;
			});

		case TodoActions.TOGGLE_ALL:
			return state.map((t) => {
				return Object.assign({}, t, {completed: action.payload});
			});

		case TodoActions.CLEAR_COMPLETED:
			return state.filter((t) => {
				return !t.completed;
			});

		default:
			return state;
	}
};

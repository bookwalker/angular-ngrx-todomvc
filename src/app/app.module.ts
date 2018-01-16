import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AutofocusModule} from 'angular-autofocus-fix';
import {RouterModule, RouterStateSnapshot, Routes} from '@angular/router';
import {MetaReducer, StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {RouterStateSerializer, StoreRouterConnectingModule} from '@ngrx/router-store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {storeFreeze} from 'ngrx-store-freeze';

import {TodoComponent} from './todo/todo.component';
import {TodoService} from './todo.service';
import {AppComponent} from './app.component';
import {AppState, rootReducerMap, RouterStateUrl} from './store/store';
import {LocalStorageEffects} from './store/localstorage.effects';
import {TodoActions} from './store/todo.actions';
import {environment} from '../environments/environment';

const routes: Routes = [
	{path: '', redirectTo: '/all', pathMatch: 'full'},
	{path: ':filter', component: TodoComponent}
];

export class CustomSerializer implements RouterStateSerializer<RouterStateUrl> {
	serialize(routerState: RouterStateSnapshot): RouterStateUrl {
		let route = routerState.root;

		while (route.firstChild) {
			route = route.firstChild;
		}

		const {url, root: {queryParams}} = routerState;
		const {params} = route;

		// Only return an object including the URL, params and query params
		// instead of the entire snapshot
		return {url, params, queryParams};
	}
}

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [storeFreeze]: [];

@NgModule({
	declarations: [
		AppComponent,
		TodoComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		AutofocusModule,
		RouterModule.forRoot(routes, {useHash: true}),
		StoreRouterConnectingModule.forRoot({
			stateKey: 'router' // name of reducer key
		}),
		StoreModule.forRoot(rootReducerMap, {metaReducers}),
		EffectsModule.forRoot([LocalStorageEffects]),
		StoreDevtoolsModule.instrument({
			maxAge: 50 /* Retains last 25 states*/
		})
	],
	providers: [
		TodoService, TodoActions,
		{provide: RouterStateSerializer, useClass: CustomSerializer}
	],
	bootstrap: [AppComponent]
})
export class AppModule {}

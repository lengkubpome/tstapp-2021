import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext, Store } from "@ngxs/store";
import { SystemAction } from "./system.action";

export interface SystemStateModel {
	loading: boolean;
}

@State<SystemStateModel>({
	name: "system",
	defaults: { loading: false },
})
@Injectable()
export class SystemState {
	constructor() {}

	@Selector()
	static loading(state: SystemStateModel): boolean {
		return state.loading;
	}

	@Action(SystemAction.LoadingShow)
	loadingShow(store: StateContext<boolean>): void {
		store.setState(true);
	}

	@Action(SystemAction.LoadingHide)
	loadingHide(store: StateContext<boolean>): void {
		store.setState(false);
	}
}

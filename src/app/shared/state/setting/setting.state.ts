import { Injectable } from "@angular/core";
import { Action, NgxsOnInit, State, StateContext, Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { SettingService } from "../../services/system.service";
import { ISetting } from "../../models/system.model";
import { SettingAction as SettingAction } from "./setting.action";

export interface SettingStateModel {
	setting: ISetting;
	isLoaded: boolean;
}

@State<SettingStateModel>({
	name: "setting",
	defaults: { setting: null, isLoaded: false },
})
@Injectable()
export class SettingState implements NgxsOnInit {
	constructor(private store: Store, private settingService: SettingService) {}

	ngxsOnInit(ctx: StateContext<SettingStateModel>): void {
		console.log("State initialized, now getting system");
		// ctx.dispatch(new SettingAction.FetchAll());
	}

	// @Action(SettingAction.FetchAll)
	// fetchAll(ctx: StateContext<SettingStateModel>): Observable<ISetting> {
	// 	return this.settingService.getSystems().pipe(
	// 		tap((result) => {
	// 			const state = ctx.getState();
	// 			ctx.setState({
	// 				...state,
	// 				setting: result[0],
	// 				isLoaded: true,
	// 			});
	// 		})
	// 	);
	// }
}

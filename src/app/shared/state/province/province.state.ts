import { catchError, tap } from "rxjs/operators";
import {
	Action,
	Actions,
	NgxsOnInit,
	ofActionCanceled,
	ofActionCompleted,
	ofActionDispatched,
	ofActionErrored,
	Selector,
	State,
	StateContext,
} from "@ngxs/store";
import { Injectable } from "@angular/core";
import { IProvince } from "../../models/province.model";
import { ProvinceAction } from "./province.action";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";

export class FetchProvinces {
	static readonly type = "[Province] Fetch Provinces";
}

export interface ProvinceStateModel {
	province: IProvince[];
	loading: boolean;
}

@State<ProvinceStateModel>({
	name: "province",
	defaults: { province: [], loading: false },
})
@Injectable()
export class ProvinceState implements NgxsOnInit {
	constructor(private http: HttpClient, private actions$: Actions) {
		// this.actions$
		// 	.pipe(ofActionErrored(FetchProvinces))
		// 	.subscribe((result) => {
		// 		console.log("Province Action Errored");
		// 		console.log(result);
		// 	});
		// this.actions$
		// 	.pipe(ofActionCompleted(FetchProvinces))
		// 	.subscribe((result) => {
		// 		console.log("Province Action Successful");
		// 		console.log(result);
		// 	});
		// this.actions$
		// 	.pipe(ofActionDispatched(FetchProvinces))
		// 	.subscribe((result) => {
		// 		console.log("Province Action Dispatched");
		// 		console.log(result);
		// 	});
		// this.actions$
		// 	.pipe(ofActionCompleted(FetchProvinces))
		// 	.subscribe((result) => {
		// 		console.log("Province Action Completed");
		// 		console.log(result);
		// 	});
	}

	@Selector()
	static province(state: ProvinceStateModel): string[] {
		const vaulesAlreadySeen = [];
		for (const p of state.province) {
			const value = p;
			if (vaulesAlreadySeen.indexOf(value.province) === -1) {
				vaulesAlreadySeen.push(value.province);
			}
		}
		return vaulesAlreadySeen;
	}

	@Selector()
	static provinceSymbol(
		state: ProvinceStateModel
	): { province: string; symbol: string }[] {
		const vaulesAlreadySeen = [];
		const result = [];
		for (const province of state.province) {
			const value = { province: province.province, symbol: province.symbol };
			if (vaulesAlreadySeen.indexOf(value.province) === -1) {
				vaulesAlreadySeen.push(value.province);
				result.push(value);
			}
		}

		return result;
	}

	ngxsOnInit(ctx: StateContext<ProvinceStateModel>): void {
		console.log("State initialized, now getting province");
		ctx.dispatch(new FetchProvinces());
	}

	@Action(FetchProvinces)
	fetchProvinces(
		ctx: StateContext<ProvinceStateModel>
	): Observable<boolean | IProvince[]> {
		ctx.patchState({ loading: true });
		return this.http.get<IProvince[]>("assets/data/province.json").pipe(
			tap((result) => {
				ctx.patchState({
					province: result,
					loading: false,
				});
			}),
			catchError((err) => {
				console.error(err);
				return of(false);
			})
		);
	}
}

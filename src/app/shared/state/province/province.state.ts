import { tap } from "rxjs/operators";
import { Action, NgxsOnInit, Selector, State, StateContext } from "@ngxs/store";
import { Injectable } from "@angular/core";
import { IProvince } from "../../models/province.model";
import { ProvinceAction } from "./province.action";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface ProvinceStateModel {
	province: IProvince[];
	isLoaded: boolean;
}

@State<ProvinceStateModel>({
	name: "province",
	defaults: { province: [], isLoaded: false },
})
@Injectable()
export class ProvinceState implements NgxsOnInit {
	constructor(private http: HttpClient) {}

	@Selector()
	static provinceOnly(state: ProvinceStateModel): string[] {
		const vaulesAlreadySeen = [];
		for (const p of state.province) {
			const value = p;
			if (vaulesAlreadySeen.indexOf(value.province) === -1) {
				vaulesAlreadySeen.push(value.province);
			}
		}
		console.log(vaulesAlreadySeen);

		return vaulesAlreadySeen;
	}

	ngxsOnInit(ctx: StateContext<ProvinceStateModel>): void {
		console.log("State initialized, now getting province");
		ctx.dispatch(new ProvinceAction.GetProvince());
	}

	@Action(ProvinceAction.GetProvince)
	getProvince(ctx: StateContext<ProvinceStateModel>): Observable<IProvince[]> {
		return this.http.get<IProvince[]>("assets/data/province.json").pipe(
			tap((result) => {
				const state = ctx.getState();
				ctx.setState({
					...state,
					province: result,
					isLoaded: true,
				});
			})
		);
	}
}

// ไม่ได้ใช้แล้ว แต่เป็นตัวอย่างการใช้ Selector

// @Select(ProvinceState.provinceOnly) province$: Observable<string[]>;

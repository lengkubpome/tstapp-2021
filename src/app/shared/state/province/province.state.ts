import { tap, distinct, map } from 'rxjs/operators';
import { Action, NgxsOnInit, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { IProvince } from '../../models/province.model';
import { ProvinceAction } from './province.action';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProvinceStateModel {
	province: IProvince[];
	isLoaded: boolean;
}

@State<ProvinceStateModel>({
	name: 'province',
	defaults: { province: [], isLoaded: false }
})
@Injectable()
export class ProvinceState implements NgxsOnInit {
	constructor(private http: HttpClient) {}

	ngxsOnInit(ctx: StateContext<ProvinceStateModel>): void {
		console.log('State initialized, now getting province');
		ctx.dispatch(new ProvinceAction.GetProvince());
	}

	@Action(ProvinceAction.GetProvince)
	getProvince(ctx: StateContext<ProvinceStateModel>): Observable<IProvince[]> {
		return this.http.get<IProvince[]>('assets/data/province.json').pipe(
			map((data: IProvince[]) => {
				const vaulesAlreadySeen = [];
				for (const p of data) {
					const value = p;
					if (vaulesAlreadySeen.indexOf(value.province) === -1) {
						vaulesAlreadySeen.push(value.province);
					}
				}
				return vaulesAlreadySeen;
			}),
			tap((result) => {
				const state = ctx.getState();
				ctx.setState({
					...state,
					province: result,
					isLoaded: true
				});
			})
		);
	}
}

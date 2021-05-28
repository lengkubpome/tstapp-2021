import { WeightingService } from './../weighting.service';
import { Injectable } from '@angular/core';
import { NgxsOnInit, Selector, State, StateContext, Action } from '@ngxs/store';
import { IWeighting } from 'src/app/shared/models/weighting.model';
import { WeightingAction } from './weighting.action';

export interface WeightingStateModel {
	weightSheets: IWeighting[];
}

@State<WeightingStateModel>({
	name: 'weighting',
	defaults: { weightSheets: [] }
})
@Injectable()
export class WeightingState implements NgxsOnInit {
	constructor(private weightingService: WeightingService) {}

	ngxsOnInit(ctx: StateContext<WeightingStateModel>): void {
		console.log('State initialized, now getting weight sheet');
		ctx.dispatch(new WeightingAction.FetchAll());
	}

	@Action(WeightingAction.FetchAll)
	fetchAll(ctx: StateContext<WeightingStateModel>): void {
		const state = ctx.getState();
		ctx.setState({
			...state,
			weightSheets: [ ...state.weightSheets, ...products ]
		});
	}

	@Action(WeightingAction.Add)
	add(
		ctx: StateContext<WeightingStateModel>,
		{ payload }: WeightingAction.Add
	): void {
		const state = ctx.getState();
		ctx.setState({
			...state,
			weightSheets: [ ...state.weightSheets, payload ]
		});
	}
	// @Action(CarAction.FetchAllCars)
	// add(
	// 	{ getState, setState }: StateContext<CarStateModel>,
	// 	{ payload }: CarAction
	// ) {
	// 	const state = getState();
	// 	setState({ items: [ ...state.items, payload ] });
	// }
}

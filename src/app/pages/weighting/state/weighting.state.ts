import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IWeightingType } from './../../../shared/models/weighting.model';
import { WeightingService } from './../weighting.service';
import { Injectable } from '@angular/core';
import { NgxsOnInit, Selector, State, StateContext, Action } from '@ngxs/store';
import { IWeighting } from 'src/app/shared/models/weighting.model';
import { WeightingAction } from './weighting.action';

export interface WeightingStateModel {
	weightSheets: IWeighting[];
  weightingTypes: IWeightingType[];
  isLoaded: boolean;
}

@State<WeightingStateModel>({
	name: 'weighting',
	defaults: { weightSheets: [], weightingTypes: [] , isLoaded: false}
})
@Injectable()
export class WeightingState implements NgxsOnInit {
	constructor(private weightingService: WeightingService) {}

	ngxsOnInit(ctx: StateContext<WeightingStateModel>): void {
		console.log('State initialized, now getting weight sheet and weighting type');
		ctx.dispatch(new WeightingAction.FetchAll());
		ctx.dispatch(new WeightingAction.FetchWeightingType());
	}

	@Action(WeightingAction.FetchAll)
	fetchAll(ctx: StateContext<WeightingStateModel>): void {
		const state = ctx.getState();
		ctx.setState({
			...state,
			weightSheets: [ ...state.weightSheets ]
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

  @Action(WeightingAction.FetchWeightingType)
  fetchWeightingType(ctx: StateContext<WeightingStateModel>): Observable<IWeightingType[]> {
    return this.weightingService.fetchWeightingType().pipe(
      tap(result => {
        const state = ctx.getState();
        ctx.setState({
          ...state,
          weightingTypes : result,
          isLoaded: true
        });
      })
    );

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

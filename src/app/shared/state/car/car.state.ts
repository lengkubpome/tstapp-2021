import { tap } from 'rxjs/operators';
import { CarService } from './../../services/car.service';
import { ICar, ICarType } from './../../models/car.model';
import { Injectable } from '@angular/core';
import { State, Action, StateContext, NgxsOnInit, Selector } from '@ngxs/store';
import { CarAction } from './car.action';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const cars: ICar[] = [
	{ id: 'กอ9555ขก', plateLCN: 'กอ-9555', plateLCP: 'ขอนแก่น' },
	{ id: '844922ขก', plateLCN: '84-4922', plateLCP: 'ขอนแก่น' },
	{ id: 'ขง2367ขก', plateLCN: 'ขง-2367', plateLCP: 'ขอนแก่น' }
];

export interface CarStateModel {
	cars: ICar[];
	type: ICarType[];
	isLoaded: boolean;
}

@State<CarStateModel>({
	name: 'car',
	defaults: { cars: [], type: [], isLoaded: false }
})
@Injectable()
export class CarState implements NgxsOnInit {
	constructor(private carService: CarService) {}

	ngxsOnInit(ctx: StateContext<CarStateModel>): void {
		console.log('State initialized, now getting cars');
		ctx.dispatch(new CarAction.FetchAll());
		ctx.dispatch(new CarAction.GetCarTypes());
	}

	@Selector()
	static myCar(state: CarStateModel): ICar[] {
		return state.cars.filter((s) => s.id == 'กอ9555ขก');
	}

	@Action(CarAction.FetchAll)
	fetchAll(ctx: StateContext<CarStateModel>): void {
		const state = ctx.getState();
		ctx.setState({
			...state,
			cars: [ ...state.cars, ...cars ]
		});
	}

	@Action(CarAction.Add)
	add(ctx: StateContext<CarStateModel>, { payload }: CarAction.Add): void {
		const state = ctx.getState();
		ctx.setState({
			...state,
			cars: [ ...state.cars, payload ]
		});
	}

	@Action(CarAction.GetCarTypes)
	getCarTypes(ctx: StateContext<CarStateModel>): Observable<ICarType[]> {
		return this.carService.getCarTypes().pipe(
			tap((result) => {
				const state = ctx.getState();
				ctx.setState({
					...state,
					type: result,
					isLoaded: true
				});
			})
		);
	}
}

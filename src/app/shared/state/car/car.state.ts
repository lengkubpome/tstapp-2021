import { map, mergeMap, tap } from "rxjs/operators";
import { CarService } from "./../../services/car.service";
import { ICar, ICarType } from "./../../models/car.model";
import { Injectable } from "@angular/core";
import { State, Action, StateContext, NgxsOnInit, Selector } from "@ngxs/store";
import { CarAction } from "./car.action";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface CarStateModel {
	cars: ICar[];
	carTypes: ICarType[];
	isLoaded: boolean;
}

@State<CarStateModel>({
	name: "car",
	defaults: { cars: [], carTypes: [], isLoaded: false },
})
@Injectable()
export class CarState implements NgxsOnInit {
	constructor(private carService: CarService) {}

	@Selector()
	static car(state: CarStateModel): ICar[] {
		return state.cars;
	}

	@Selector()
	static carType(state: CarStateModel): ICarType[] {
		return state.carTypes;
	}

	ngxsOnInit(ctx: StateContext<CarStateModel>): void {
		console.log("State initialized, now getting cars");
		ctx.dispatch(new CarAction.FetchCarTypes());
		ctx.dispatch(new CarAction.FetchCars());
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Car Action
	// -----------------------------------------------------------------------------------------------------

	@Action(CarAction.FetchCars)
	fetchCars(ctx: StateContext<CarStateModel>): any {
		return this.carService.getCars().pipe(
			tap((actions) => {
				const carType = ctx.getState().carTypes;
				actions.map((c) => {
					c.type = carType.filter((t) => t.id === c.type)[0].id;
				});
				const state = ctx.getState();
				ctx.setState({
					...state,
					cars: actions,
					isLoaded: true,
				});
			})
		);
	}

	@Action(CarAction.Add)
	add(ctx: StateContext<CarStateModel>, { payload }: CarAction.Add): void {
		const state = ctx.getState();
		ctx.setState({
			...state,
			cars: [...state.cars, payload],
		});
	}

	// -----------------------------------------------------------------------------------------------------
	// @ CarType Action
	// -----------------------------------------------------------------------------------------------------

	@Action(CarAction.FetchCarTypes)
	fetchCarTypes(ctx: StateContext<CarStateModel>): any {
		return this.carService.getCarTypes().pipe(
			tap((result) => {
				const state = ctx.getState();
				ctx.setState({
					...state,
					carTypes: result,
					isLoaded: true,
				});
			})
		);
	}
}

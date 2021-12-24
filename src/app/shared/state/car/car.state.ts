import { map, mergeMap, tap } from "rxjs/operators";
import { CarService } from "./../../services/car.service";
import { ICar, ICarType } from "./../../models/car.model";
import { Injectable } from "@angular/core";
import {
	State,
	Action,
	StateContext,
	NgxsOnInit,
	Selector,
	Actions,
	ofActionErrored,
	ofActionCompleted,
	ofActionDispatched,
} from "@ngxs/store";
import { CarAction } from "./car.action";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface CarStateModel {
	cars: ICar[];
	carTypes: ICarType[];
	loading: boolean;
}

@State<CarStateModel>({
	name: "car",
	defaults: { cars: [], carTypes: [], loading: false },
})
@Injectable()
export class CarState implements NgxsOnInit {
	constructor(private carService: CarService, private actions$: Actions) {
		// this.actions$
		// 	.pipe(ofActionErrored(CarAction.FetchCars, CarAction.FetchCarTypes))
		// 	.subscribe((result) => {
		// 		console.log("%cCarAction Errored", "color:red; font-size:20px");
		// 		console.log(result);
		// 	});
		// this.actions$
		// 	.pipe(ofActionCompleted(CarAction.FetchCars, CarAction.FetchCarTypes))
		// 	.subscribe((result) => {
		// 		console.log("%cCarAction Successful", "color:white; font-size:20px");
		// 		console.log(result);
		// 	});
		// this.actions$
		// 	.pipe(ofActionDispatched(CarAction.FetchCars, CarAction.FetchCarTypes))
		// 	.subscribe((result) => {
		// 		console.log("%cCarAction Dispatched", "color:pink; font-size:20px");
		// 		console.log(result);
		// 	});
		// this.actions$
		// 	.pipe(ofActionCompleted(CarAction.FetchCars, CarAction.FetchCarTypes))
		// 	.subscribe((result) => {
		// 		console.log("%cCarAction Completed", "color:#7FFF00; font-size:20px");
		// 		console.log(result);
		// 	});
	}

	@Selector()
	static car(state: CarStateModel): ICar[] {
		return state.cars;
	}

	@Selector()
	static carType(state: CarStateModel): ICarType[] {
		return state.carTypes;
	}

	ngxsOnInit(ctx: StateContext<CarStateModel>): void {
		console.log(
			"%cState initialized, now getting cars",
			"color:orange; font-size:20px"
		);

		ctx.dispatch(new CarAction.FetchCarTypes());
		ctx.dispatch(new CarAction.FetchCars());
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Car Action
	// -----------------------------------------------------------------------------------------------------

	// @Action(CarAction.FetchCars)
	// fetchCars(ctx: StateContext<CarStateModel>): any {
	// 	console.log("%cfetchCars", "color:blue; font-size:20px");
	// 	this.carService
	// 		.getCars()
	// 		.then((actions) => {
	// 			const car = ctx.getState().cars;
	// 			actions.map((c) => {
	// 				c.type = car.filter((t) => t.id === c.type)[0].id;
	// 			});
	// 			ctx.patchState({ cars: actions, loading: true });
	// 		})
	// 		.finally(() => {
	// 			console.log(ctx.getState());
	// 			ctx.patchState({ loading: false });
	// 		});
	// }

	@Action(CarAction.FetchCars)
	fetchCars(ctx: StateContext<CarStateModel>): any {
		ctx.patchState({ loading: true });
		return this.carService.getCars().pipe(
			tap((actions) => {
				const carType = ctx.getState().carTypes;
				actions.map((c) => {
					c.type = carType.filter((t) => t.id === c.type)[0].id;
				});
				ctx.patchState({
					cars: actions,
					loading: true,
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
					loading: true,
				});
			})
		);
	}
}

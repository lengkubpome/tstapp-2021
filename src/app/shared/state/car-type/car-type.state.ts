import { ICarType } from './../../models/car.model';
import { Injectable } from '@angular/core';
import { State, Action, StateContext, NgxsOnInit, Selector } from '@ngxs/store';
import { CarTypeAction } from './car-type.action';

const carTypes: ICarType[] = [
	{ id: '1', en: 'pickup-truck', th: 'กระบะ' },
	{ id: '2', en: 'mini-truck', th: 'รถบรรทุกเล็ก' },
	{ id: '3', en: 'truck', th: 'รถบรรทุก (6 - 12 ล้อ)' },
	{ id: '4', en: 'tractor', th: 'รถแทรกเตอร์ (หัวลาก)' },
	{ id: '5', en: 'trailer', th: 'พ่วงคอก (หาง)' },
	{ id: '6', en: 'flatbed-trailer', th: 'พ่วงพื้นเรียบ (หาง)' },
	{ id: '7', en: 'motorcycle-truck', th: 'มอเตอร์ไซค์พ่วง' },
	{ id: '0', en: 'etc', th: 'อื่นๆ' }
];

export interface CarTypeStateModel {
	carTypes: ICarType[];
}

@State<CarTypeStateModel>({
	name: 'carType',
	defaults: { carTypes: [] }
})
@Injectable()
export class CarTypeState implements NgxsOnInit {
	ngxsOnInit(ctx: StateContext<CarTypeStateModel>): void {
		console.log('State initialized, now getting car types');
		ctx.dispatch(new CarTypeAction.FetchAll());
	}

	@Action(CarTypeAction.FetchAll)
	fetchAll(ctx: StateContext<CarTypeStateModel>): void {
		const state = ctx.getState();
		ctx.setState({
			...state,
			carTypes: [ ...state.carTypes, ...carTypes ]
		});
	}

	@Action(CarTypeAction.Add)
	add(
		ctx: StateContext<CarTypeStateModel>,
		{ payload }: CarTypeAction.Add
	): void {
		const state = ctx.getState();
		ctx.setState({
			...state,
			carTypes: [ ...state.carTypes, payload ]
		});
	}
}

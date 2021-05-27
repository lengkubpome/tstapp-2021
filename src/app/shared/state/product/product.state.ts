import { Injectable } from '@angular/core';
import { NgxsOnInit, Selector, State, StateContext, Action } from '@ngxs/store';
import { IProduct } from './../../models/product.model';
import { ProductAction } from './product.action';

const products: IProduct[] = [
	{ id: 'p1001', name: 'กล่อง', currentPrice: 6.7 },
	{ id: 'p1002', name: 'กระดาษสี', currentPrice: 5.1 },
	{ id: 'p1003', name: 'เศษเหล็ก', currentPrice: 13.5 },
	{ id: 'p1004', name: 'เหล็กหนา', currentPrice: 14.0 },
	{ id: 'p1005', name: 'กระป๋อง', currentPrice: 8.0 },
	{ id: 'p1006', name: 'สังกะสี', currentPrice: 7.6 }
];

export interface ProductStateModel {
	products: IProduct[];
}

@State<ProductStateModel>({
	name: 'product',
	defaults: { products: [] }
})
@Injectable()
export class ProductState implements NgxsOnInit {
	ngxsOnInit(ctx: StateContext<ProductStateModel>): void {
		console.log('State initialized, now getting product');
		ctx.dispatch(new ProductAction.FetchAll());
	}

	@Selector()
	static myCar(state: ProductStateModel): IProduct[] {
		return state.products.filter((s) => s.id == 'p1003');
	}

	@Action(ProductAction.FetchAll)
	fetchAll(ctx: StateContext<ProductStateModel>): void {
		const state = ctx.getState();
		ctx.setState({
			...state,
			products: [ ...state.products, ...products ]
		});
	}

	@Action(ProductAction.Add)
	add(
		ctx: StateContext<ProductStateModel>,
		{ payload }: ProductAction.Add
	): void {
		const state = ctx.getState();
		ctx.setState({
			...state,
			products: [ ...state.products, payload ]
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

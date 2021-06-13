import { tap } from 'rxjs/operators';
import { ProductService } from './../../services/product.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { NgxsOnInit, Selector, State, StateContext, Action } from '@ngxs/store';
import { IProduct } from './../../models/product.model';
import { ProductAction } from './product.action';

export interface ProductStateModel {
	products: IProduct[];
	isLoaded: boolean;
}

@State<ProductStateModel>({
	name: 'product',
	defaults: { products: [], isLoaded: false }
})
@Injectable()
export class ProductState implements NgxsOnInit {
	constructor(private productService: ProductService) {}

	ngxsOnInit(ctx: StateContext<ProductStateModel>): void {
		console.log('State initialized, now getting product');
		ctx.dispatch(new ProductAction.FetchAll());
	}

	@Action(ProductAction.FetchAll)
	fetchAll(ctx: StateContext<ProductStateModel>): Observable<IProduct[]> {
		return this.productService.getProducts().pipe(
			tap((result) => {
				const state = ctx.getState();
				ctx.setState({
					...state,
					products: result,
					isLoaded: true
				});
			})
		);
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
}

import { Injectable } from '@angular/core';
import { IProduct, ProductData } from '../models/product.model';

@Injectable({
	providedIn: 'root'
})
export class ProductService extends ProductData {
	private products: IProduct[] = [
		{ id: '1', name: 'กล่อง', currentPrice: 6.7 },
		{ id: '2', name: 'กระดาษสี', currentPrice: 5.1 },
		{ id: '3', name: 'เศษเหล็ก', currentPrice: 13.6 },
		{ id: '4', name: 'เหล็กหนา', currentPrice: 14.1 },
		{ id: '5', name: 'กระป๋อง', currentPrice: 8.6 },
		{ id: '6', name: 'สังกะสี', currentPrice: 8.2 }
	];

	constructor() {
		super();
	}
}

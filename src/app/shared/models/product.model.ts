import { Observable } from 'rxjs';
export interface IProduct {
	id: string;
	name: string;
	currentPrice: number;
}

export abstract class ProductData {
	abstract getProducts(): Observable<IProduct[]>;
}

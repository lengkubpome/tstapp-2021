import { Observable } from 'rxjs';
export interface Product {
	id: string;
	name: string;
	currentPrice: number;
}

export abstract class ProductData {
	abstract getProducts(): Observable<Product[]>;
}

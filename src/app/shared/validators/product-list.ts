import { IProduct } from '../models/product.model';
import { AbstractControl, ValidatorFn } from '@angular/forms';

export function productList(products: IProduct[]): ValidatorFn {
	return (control: AbstractControl): { [key: string]: any } | null =>
		products.find((product) => product.name === control.value)
			? null
			: { notFound: control.value };
}

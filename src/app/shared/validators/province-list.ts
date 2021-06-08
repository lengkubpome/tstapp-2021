import { AbstractControl, ValidatorFn } from '@angular/forms';
import { IProvince } from './../models/province.model';
export function provinceList(provinces: string[]): ValidatorFn {
	return (control: AbstractControl): { [key: string]: any } | null =>
		provinces.find((province) => province === control.value)
			? null
			: { notFound: control.value };
}

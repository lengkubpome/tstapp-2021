import { AbstractControl, ValidatorFn } from '@angular/forms';

export function provinceInList(provinces: string[]): ValidatorFn {
	return (control: AbstractControl): { [key: string]: any } | null =>
		provinces.find((province) => province === control.value)
			? null
			: { notInList: control.value };
}

import { ICar, ICarType } from '../models/car.model';
import { AbstractControl, ValidatorFn } from '@angular/forms';

export function carInList(cars: ICar[]): ValidatorFn {
	return (control: AbstractControl): { [key: string]: any } | null => {
		if (control.value) {
			return cars.find((car) => car === control.value)
				? null
				: { notInList: control.value };
		}
		return null;
	};
}

export function carTypesInListTH(types: ICarType[]): ValidatorFn {
	return (control: AbstractControl): { [key: string]: any } | null => {
		if (control.value) {
			return types.find((type) => type.th === control.value)
				? null
				: { notInList: control.value };
		}
		return null;
	};
}

import { IProvince } from "./../models/province.model";
import {
	ProvinceState,
	ProvinceStateModel,
} from "./../state/province/province.state";
import { CarStateModel } from "src/app/shared/state/car/car.state";
import { CarState } from "src/app/shared/state/car/car.state";
import { IProduct } from "src/app/shared/models/product.model";
import { Injectable } from "@angular/core";
import { Select } from "@ngxs/store";
import { Observable, of } from "rxjs";
import {
	AbstractControl,
	AsyncValidatorFn,
	ValidationErrors,
} from "@angular/forms";
import { map, take } from "rxjs/operators";
import { IWeightingType } from "src/app/shared/models/weighting.model";
import { ProductStateModel } from "../state/product/product.state";

@Injectable({
	providedIn: "root",
})
export class UniversalValidator {
	@Select(CarState) car$: Observable<CarStateModel>;
	@Select(ProvinceState.province) province$: Observable<string[]>;

	provinceAsyncValidator(): AsyncValidatorFn {
		return (control: AbstractControl): Observable<ValidationErrors | null> => {
			if (!control.value) {
				return of(null);
			} else {
				return this.province$.pipe(
					take(1),
					map((provinces) => {
						const result = provinces.filter(
							(province) => province === control.value
						).length;
						return result ? null : { exist: true };
					})
				);
			}
		};
	}

	carTypeAsyncValidator(findInProperties?: string): AsyncValidatorFn {
		return (control: AbstractControl): Observable<ValidationErrors | null> => {
			if (!control.value) {
				return of(null);
			} else {
				return this.car$.pipe(
					take(1),
					map((stateModel) => {
						const types: IWeightingType[] = stateModel.carTypes;
						const result = types.filter(
							(obj) => obj[findInProperties] === control.value
						).length;
						return result ? null : { exist: true };
					})
				);
			}
		};
	}
}

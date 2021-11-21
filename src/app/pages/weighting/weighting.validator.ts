import { IProduct } from "src/app/shared/models/product.model";
import {
	ProductState,
	ProductStateModel,
} from "./../../shared/state/product/product.state";
import { WeightingState, WeightingStateModel } from "./state/weighting.state";
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

@Injectable()
export class WeightingValidator {
	@Select(WeightingState) weighting$: Observable<WeightingStateModel>;

	weightingTypeAsyncValidator(findInProperties?: string): AsyncValidatorFn {
		return (control: AbstractControl): Observable<ValidationErrors | null> => {
			if (!control.value) {
				return of(null);
			} else {
				return this.weighting$.pipe(
					take(1),
					map((stateModel) => {
						const types: IWeightingType[] = stateModel.weightingTypes;
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

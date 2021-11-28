import { IContact } from "src/app/shared/models/contact.model";
import {
	ContactState,
	ContactStateModel,
} from "./../state/contact/contact.state";
import { ICarType } from "../models/car.model";
import { IProvince } from "../models/province.model";
import {
	ProvinceState,
	ProvinceStateModel,
} from "../state/province/province.state";
import { CarStateModel } from "src/app/shared/state/car/car.state";
import { CarState } from "src/app/shared/state/car/car.state";
import { IProduct } from "src/app/shared/models/product.model";
import { Injectable } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { Observable, of } from "rxjs";
import {
	AbstractControl,
	AsyncValidatorFn,
	ValidationErrors,
	ValidatorFn,
} from "@angular/forms";
import { map, take } from "rxjs/operators";
import { IWeightingType } from "src/app/shared/models/weighting.model";
import {
	ProductState,
	ProductStateModel,
} from "../state/product/product.state";

@Injectable({
	providedIn: "root",
})
export class UtilityValidator {
	@Select(CarState) car$: Observable<CarStateModel>;
	@Select(ContactState) contact$: Observable<ContactStateModel>;
	@Select(ProductState) product$: Observable<ProductStateModel>;
	// ไม่ใช้ รอลบทิ้ง
	// @Select(ProvinceState.province) province$: Observable<string[]>;

	constructor(private store: Store) {}

	// -----------------------------------------------------------------------------------------------------
	// @ Public ValidatorFn methods
	// -----------------------------------------------------------------------------------------------------

	// ฟังก์ชั่นตรวจสอบข้อมูลใน List (Object as Array) และสามารถเลือกตรวจสอบค่า Property ตามต้องการ
	inList(list: any[], findInProperties?: string[]): ValidatorFn {
		return (control: AbstractControl): { [key: string]: any } | null => {
			let result = null;
			if (control.value) {
				if (!findInProperties) {
					result = list.find((item) => item === control.value)
						? null
						: { notInList: control.value };
				} else if (typeof control.value === "string") {
					let isInList = false;
					list.forEach((obj) => {
						let value = "";

						findInProperties.forEach((key) => {
							if (key in obj) {
								value = value + obj[key];
							}
						});

						if (value.replace(/\s/g, "") === control.value.replace(/\s/g, "")) {
							isInList = true;
						}
					});

					if (!isInList) {
						result = { notInList: control.value };
					}
				} else {
					result = { ...result, error: " value is not string" };
				}
			}
			// console.log(result);

			return result;
		};
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Public AsyncValidatorFn methods
	// -----------------------------------------------------------------------------------------------------

	productAsyncValidator(findInProperties?: string): AsyncValidatorFn {
		return (control: AbstractControl): Observable<ValidationErrors | null> => {
			if (!control.value) {
				return of(null);
			} else {
				return this.product$.pipe(
					take(1),
					map((stateModel) => {
						const products: IProduct[] = stateModel.products;
						const result = products.filter(
							(obj) => obj[findInProperties] === control.value
						).length;
						return result ? null : { exist: true };
					})
				);
			}
		};
	}

	carTypeAsyncValidator(): AsyncValidatorFn {
		return (control: AbstractControl): Observable<ValidationErrors | null> => {
			if (!control.value) {
				return of(null);
			} else {
				return this.car$.pipe(
					take(1),
					map((stateModel) => {
						const types: ICarType[] = stateModel.carTypes;
						const result = types.filter(
							(obj) => obj["name"] === control.value
						).length;
						return result ? null : { exist: true };
					})
				);
			}
		};
	}
	contactAsyncValidator(): AsyncValidatorFn {
		return (control: AbstractControl): Observable<ValidationErrors | null> => {
			if (!control.value) {
				return of(null);
			} else {
				return this.contact$.pipe(
					take(1),
					map((stateModel) => {
						const contacts: IContact[] = stateModel.contacts;
						const result = contacts.filter(
							(contact) => contact.name === control.value
						).length;
						return result ? null : { exist: true };
					})
				);
			}
		};
	}

	// ไม่ใช้ รอลบ
	// ฟังก์ชั่นตรวจสอบข้อมูลจังหวัด
	// provinceAsyncValidator(): AsyncValidatorFn {
	// 	return (control: AbstractControl): Observable<ValidationErrors | null> => {
	// 		if (!control.value) {
	// 			return of(null);
	// 		} else {
	// 			return this.province$.pipe(
	// 				take(1),
	// 				map((provinces) => {
	// 					const result = provinces.filter(
	// 						(province) => province === control.value
	// 					).length;
	// 					return result ? null : { exist: true };
	// 				})
	// 			);
	// 		}
	// 	};
	// }
}

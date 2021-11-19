import { UniversalValidator } from "../../../shared/validators/universal.validator";
import {
	takeUntil,
	startWith,
	debounceTime,
	map,
	mergeMap,
} from "rxjs/operators";
import { ProvinceState } from "src/app/shared/state/province/province.state";
import { CarStateModel } from "src/app/shared/state/car/car.state";
import { Observable, Subject } from "rxjs";

import { Select, Store } from "@ngxs/store";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ICar, ICarType } from "src/app/shared/models/car.model";
import { Component, Input, OnInit } from "@angular/core";
import { NbDialogRef } from "@nebular/theme";
import { CarState } from "src/app/shared/state/car/car.state";
import { inList } from "src/app/shared/validators/in-list.validator";

@Component({
	selector: "app-car-info",
	templateUrl: "./car-info.component.html",
	styleUrls: ["./car-info.component.scss"],
})
export class CarInfoComponent implements OnInit {
	@Input() title: string;
	@Input() car: ICar;
	@Input() newCar: boolean;

	@Select(CarState) car$: Observable<CarStateModel>;
	@Select(ProvinceState.provinceOnly) province$: Observable<string[]>;

	filteredCarTypes: Observable<ICarType[]>;

	filteredProvinces: Observable<string[]>;

	stateEdit: boolean;

	carInfoForm: FormGroup;

	// Private
	private unsubscribeAll: Subject<any> = new Subject();

	constructor(
		protected ref: NbDialogRef<CarInfoComponent>,
		private formBuilder: FormBuilder,
		private store: Store,
		private universalValidator: UniversalValidator
	) {}

	ngOnInit(): void {
		this.carInfoForm = this.setupForm(this.car);
		this.stateEdit = this.newCar;

		console.log(this.car);
		console.log(this.newCar);

		this.filterControls();
	}

	setupForm(car: ICar): FormGroup {
		return this.formBuilder.group({
			id: [car.id],
			plateLCN: [car.plateLCN, Validators.required],
			plateLCP: [
				car.plateLCP,
				{
					asyncValidators: [this.universalValidator.provinceAsyncValidator()],
				},
			],
			type: [
				car.type.th,
				{
					asyncValidators: [
						this.universalValidator.carTypeAsyncValidator("th"),
					],
				},
			],
		});
	}

	onSubmitCarInfo(): void {
		if (this.carInfoForm.valid) {
			this.ref.close(this.car);
		}
	}

	onClose(): void {
		this.ref.close(null);
	}

	onSelectCarType(selectCarType: ICarType): void {
		this.carInfoForm.get("type").setValue(selectCarType.th);
		this.car.type = selectCarType;
	}

	private filterControls(): void {
		this.filteredProvinces = this.carInfoForm.get("plateLCP").valueChanges.pipe(
			startWith(""),
			debounceTime(100),
			mergeMap((inputValue) => {
				return this.province$.pipe(
					map((provinces) => {
						return inputValue
							? provinces.filter((province) =>
									this._normalizeValue(province).includes(
										this._normalizeValue(inputValue)
									)
							  )
							: provinces;
					})
				);
			})
		);

		this.filteredCarTypes = this.carInfoForm.get("type").valueChanges.pipe(
			startWith(""),
			debounceTime(100),
			mergeMap((inputValue) => {
				return this.car$.pipe(
					map((stateModel) => {
						const types = stateModel.carTypes;
						return inputValue
							? types.filter((type) =>
									this._normalizeValue(type.id + type.th).includes(
										this._normalizeValue(inputValue)
									)
							  )
							: types;
					})
				);
			})
		);
	}

	private _normalizeValue(value: string): string {
		return value.toLowerCase().replace(/\s/g, "");
	}
}

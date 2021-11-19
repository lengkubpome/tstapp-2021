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

	@Select(CarState) car$: Observable<CarStateModel>;

	filteredCarTypes: Observable<ICarType[]>;

	provinces: string[];
	filteredProvinces: Observable<string[]>;

	stateEdit = false;

	carInfoForm: FormGroup;

	// Private
	private unsubscribeAll: Subject<any> = new Subject();

	constructor(
		protected ref: NbDialogRef<CarInfoComponent>,
		private formBuilder: FormBuilder,
		private store: Store,
		private universalValidator: UniversalValidator
	) {
		this.provinces = this.store.selectSnapshot(ProvinceState.provinceOnly);

		this.carInfoForm = this.formBuilder.group({
			id: [""],
			plateLCN: ["", Validators.required],
			plateLCP: [
				null,
				{
					asyncValidators: [this.universalValidator.provinceAsyncValidator()],
				},
			],
			type: [
				null,
				{
					asyncValidators: [
						this.universalValidator.carTypeAsyncValidator("th"),
					],
				},
			],
		});
	}

	ngOnInit(): void {
		if (this.car.id !== "NEW") {
			this.stateEdit = false;
			this.carInfoForm.get("id").setValue(this.car.id);
			this.carInfoForm.get("plateLCN").setValue(this.car.plateLCN);
			this.carInfoForm.get("plateLCP").setValue(this.car.plateLCP);
			this.carInfoForm.get("type").setValue(this.car.type);
		} else {
			this.stateEdit = true;
			this.carInfoForm.get("id").setValue(this.car.id);
			this.carInfoForm.get("plateLCN").setValue(this.car.plateLCN);
		}

		this.filterControls();
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
		// const carType = this.carTypes.find((t) => t.id === selectCarType.id);
		this.carInfoForm.get("type").setValue(selectCarType.th);
		this.car.type = selectCarType;
	}

	private filterControls(): void {
		this.filteredProvinces = this.carInfoForm.get("plateLCP").valueChanges.pipe(
			takeUntil(this.unsubscribeAll),
			startWith(""),
			debounceTime(300),
			map((value) =>
				value ? this._filterProvinces(value) : this.provinces.slice()
			)
		);

		this.filteredCarTypes = this.carInfoForm.get("type").valueChanges.pipe(
			startWith(""),
			debounceTime(300),
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

	private _filterProvinces(value: string): string[] {
		const filterValue = this._normalizeValue(value);
		return this.provinces.filter((province) =>
			this._normalizeValue(province).includes(filterValue)
		);
	}

	private _normalizeValue(value: string): string {
		return value.toLowerCase().replace(/\s/g, "");
	}
}

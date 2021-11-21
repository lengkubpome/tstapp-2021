import { UtilityValidator } from "../../../shared/validators/utility.validator";
import {
	takeUntil,
	startWith,
	debounceTime,
	map,
	mergeMap,
	take,
} from "rxjs/operators";
import { ProvinceState } from "src/app/shared/state/province/province.state";
import { Observable, Subject } from "rxjs";

import { Store } from "@ngxs/store";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ICar, ICarType } from "src/app/shared/models/car.model";
import { Component, Input, OnInit } from "@angular/core";
import { NbDialogRef } from "@nebular/theme";
import { CarState } from "src/app/shared/state/car/car.state";

@Component({
	selector: "app-car-info",
	templateUrl: "./car-info.component.html",
	styleUrls: ["./car-info.component.scss"],
})
export class CarInfoComponent implements OnInit {
	@Input() title: string;
	@Input() car: ICar;
	@Input() newCar: boolean;

	provinceSymbols: { province: string; symbol: string }[];
	carTypes: ICarType[];

	filteredCarTypes: Observable<ICarType[]>;

	filteredProvinces: Observable<string[]>;

	stateCarInfo = {
		edit: false,
	};

	carInfoForm: FormGroup;

	// Private
	private unsubscribeAll: Subject<any> = new Subject();

	constructor(
		protected ref: NbDialogRef<CarInfoComponent>,
		private formBuilder: FormBuilder,
		private store: Store,
		private utilityValidator: UtilityValidator
	) {
		this.provinceSymbols = this.store.selectSnapshot<any>(
			ProvinceState.provinceSymbol
		);

		this.carTypes = this.store.selectSnapshot<ICarType[]>(CarState.carType);
	}

	ngOnInit(): void {
		this.stateCarInfo.edit = this.newCar;

		this.carInfoForm = this.setupForm(this.car);
		this.eventControls();
		this.filterControls();
	}

	setupForm(car: ICar): FormGroup {
		return this.formBuilder.group({
			id: [car.id],
			plateLCN: [car.plateLCN, { validators: Validators.required }],
			plateLCP: [
				car.plateLCP,
				{
					validators: [
						this.utilityValidator.inList(
							this.provinceSymbols.map((p) => p.province)
						),
					],
					// asyncValidators: [this.universalValidator.provinceAsyncValidator()],
				},
			],
			type: [
				car.hasOwnProperty("type") ? car.type.th : null,
				{
					asyncValidators: [this.utilityValidator.carTypeAsyncValidator("th")],
				},
			],
		});
	}

	generateID(): void {
		const prefix = this.car.plateLCN;
		const suffix = this.provinceSymbols.filter(
			(p) => p.province === this.car.plateLCP
		)[0].symbol;
		const id = prefix + suffix;
		this.car.id = id;
		this.carInfoForm.get("id").setValue(id);
	}

	isDuplicateCar(): boolean {
		// 	var x = this.car$.pipe(
		// 		map((stateModel) => {
		// 			const types = stateModel.cars;
		// 			return inputValue
		// 				? types.filter((type) =>
		// 						this._normalizeValue(type.id + type.th).includes(
		// 							this._normalizeValue(inputValue)
		// 						)
		// 				  )
		// 				: types;
		// 		})
		// 	);
		return false;
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Func Set Control Input Event methods
	// -----------------------------------------------------------------------------------------------------

	onSubmitCarInfo(): void {
		if (this.carInfoForm.valid) {
			console.log(this.car);

			this.ref.close(this.car);
		}
	}

	onClose(): void {
		this.ref.close();
	}

	onSelectCarType(selectCarType: ICarType): void {
		this.carInfoForm.get("type").setValue(selectCarType.th);
		this.car.type = selectCarType;
	}

	private eventControls(): void {
		this.carInfoForm
			.get("plateLCN")
			.valueChanges.pipe(
				takeUntil(this.unsubscribeAll),
				startWith(""),
				debounceTime(300)
			)
			.subscribe((result) => {
				if (result) {
					this.car.plateLCN = result;
					this.generateID();
				}
			});

		this.carInfoForm
			.get("plateLCP")
			.valueChanges.pipe(
				takeUntil(this.unsubscribeAll),
				startWith(""),
				debounceTime(300),
				map((input) => {
					return this.provinceSymbols.filter((p) => p.province === input);
				})
			)
			.subscribe((result) => {
				if (result.length) {
					this.car.plateLCP = result[0].province;
					this.generateID();
				}
			});

		// ป้องกันกรณีผู้ใช้ พิมพ์ชื่อเต็มๆโดยไม่ผ่าน Autocomplete
		this.carInfoForm
			.get("type")
			.valueChanges.pipe(
				takeUntil(this.unsubscribeAll),
				startWith(""),
				debounceTime(300),
				map((input) => {
					return this.carTypes.filter((type) => type.th === input);
				})
			)
			.subscribe((result) => {
				if (result.length) {
					this.car.type = result[0];
				}
			});
	}

	private filterControls(): void {
		this.filteredProvinces = this.carInfoForm.get("plateLCP").valueChanges.pipe(
			startWith(""),
			debounceTime(100),
			map((input) => {
				const provinces = this.provinceSymbols.map((p) => p.province); // ดึงเฉพาะ province
				return input
					? provinces.filter((province) =>
							this._normalizeValue(province).includes(
								this._normalizeValue(input)
							)
					  )
					: provinces;
			})
		);

		this.filteredCarTypes = this.carInfoForm.get("type").valueChanges.pipe(
			startWith(""),
			debounceTime(100),
			map((input) => {
				return input
					? this.carTypes.filter((type) =>
							this._normalizeValue(type.id + type.th).includes(
								this._normalizeValue(input)
							)
					  )
					: this.carTypes;
			})
		);
	}

	private _normalizeValue(value: string): string {
		return value.toLowerCase().replace(/\s/g, "");
	}
}

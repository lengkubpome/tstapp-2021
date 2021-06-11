import { takeUntil, startWith, debounceTime, map } from 'rxjs/operators';
import { ProvinceState } from './../../../../shared/state/province/province.state';
import { CarStateModel } from './../../../../shared/state/car/car.state';
import { Observable, Subject } from 'rxjs';

import { Select, Store } from '@ngxs/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICar, ICarType } from './../../../../shared/models/car.model';
import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { CarState } from 'src/app/shared/state/car/car.state';
import { inList } from 'src/app/shared/validators/in-list.validator';

@Component({
	selector: 'app-car-info',
	templateUrl: './car-info.component.html',
	styleUrls: [ './car-info.component.scss' ]
})
export class CarInfoComponent implements OnInit {
	@Input() title: string;
	@Input() car: ICar;

	@Select(CarState) car$: Observable<CarStateModel>;

	carTypes: ICarType[];
	filteredCarTypes: Observable<ICarType[]>;

	provinces: string[];
	filteredProvinces: Observable<string[]>;

	stateEdit = false;

	carInfoForm: FormGroup;

	// Private
	private unsubscribeAll: Subject<any>;

	constructor(
		protected ref: NbDialogRef<CarInfoComponent>,
		private formBuilder: FormBuilder,
		private store: Store
	) {
		this.provinces = this.store.selectSnapshot(ProvinceState.provinceOnly);
		this.carTypes = this.store.selectSnapshot(CarState.carType);

		this.carInfoForm = this.formBuilder.group({
			id: [ '' ],
			plateLCN: [ '', Validators.required ],
			plateLCP: [ '', Validators.compose([ inList(this.provinces) ]) ],
			type: [ '', Validators.compose([ inList(this.carTypes, 'th') ]) ]
		});

		this.unsubscribeAll = new Subject();
	}

	ngOnInit(): void {
		if (this.car.id !== 'NEW') {
			this.stateEdit = false;
			this.carInfoForm.get('id').setValue(this.car.id);
			this.carInfoForm.get('plateLCN').setValue(this.car.plateLCN);
			this.carInfoForm.get('plateLCP').setValue(this.car.plateLCP);
			this.carInfoForm.get('type').setValue(this.car.type);
		} else {
			this.stateEdit = true;
			this.carInfoForm.get('id').setValue(this.car.id);
			this.carInfoForm.get('plateLCN').setValue(this.car.plateLCN);
		}

		this.filterFunc();
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
		const carType = this.carTypes.find((t) => t.id === selectCarType.id);
		this.carInfoForm.get('type').setValue(carType.th);
		this.car.type = carType;
	}

	private filterFunc(): void {
		this.filteredProvinces = this.carInfoForm
			.get('plateLCP')
			.valueChanges.pipe(
				takeUntil(this.unsubscribeAll),
				startWith(''),
				debounceTime(300),
				map(
					(value) =>
						value ? this._filterProvinces(value) : this.provinces.slice()
				)
			);

		this.filteredCarTypes = this.carInfoForm
			.get('type')
			.valueChanges.pipe(
				takeUntil(this.unsubscribeAll),
				startWith(''),
				debounceTime(300),
				map(
					(value) =>
						value ? this._filterCarType(value) : this.carTypes.slice()
				)
			);
	}

	private _filterProvinces(value: string): string[] {
		const filterValue = this._normalizeValue(value);
		return this.provinces.filter((province) =>
			this._normalizeValue(province).includes(filterValue)
		);
	}

	private _filterCarType(value: string): ICarType[] {
		const filterValue = this._normalizeValue(value);
		return this.carTypes.filter((type) =>
			this._normalizeValue(type.id + type.th).includes(filterValue)
		);
	}

	private _normalizeValue(value: string): string {
		return value.toLowerCase().replace(/\s/g, '');
	}
}

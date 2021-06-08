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
import { provinceList } from 'src/app/shared/validators/province-list';

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
		this.provinces = this.store.selectSnapshot(ProvinceState.onlyProvince);

		this.carInfoForm = this.formBuilder.group({
			id: [ '' ],
			plateLCN: [ '', Validators.required ],
			plateLCP: [ '', Validators.compose([ provinceList(this.provinces) ]) ],
			typeId: [ '' ]
		});

		this.unsubscribeAll = new Subject();
	}

	ngOnInit(): void {
		if (this.car.id !== 'NEW') {
			this.stateEdit = false;
			this.carInfoForm.get('id').setValue(this.car.id);
			this.carInfoForm.get('plateLCN').setValue(this.car.plateLCN);
			this.carInfoForm.get('plateLCP').setValue(this.car.plateLCP);
			this.carInfoForm.get('typeId').setValue(this.car.typeId);
		} else {
			this.stateEdit = true;
			this.carInfoForm.get('id').setValue(this.car.id);
			this.carInfoForm.get('plateLCN').setValue(this.car.plateLCN);
		}

		this.filterProvinces();
	}

	onSubmitCarInfo(): void {
		console.log(this.carInfoForm.valid);

		// this.ref.close(this.carInfoForm.value);
	}

	onClose(): void {
		this.ref.close(null);
	}

	private filterProvinces(): void {
		this.filteredProvinces = this.carInfoForm
			.get('plateLCP')
			.valueChanges.pipe(
				takeUntil(this.unsubscribeAll),
				startWith(''),
				debounceTime(300),
				map(
					(province) =>
						province ? this._filterProvinces(province) : this.provinces.slice()
				)
			);
	}

	private _filterProvinces(value: string): string[] {
		const filterValue = this._normalizeValue(value);
		return this.provinces.filter((province) =>
			this._normalizeValue(province).includes(filterValue)
		);
	}

	private _normalizeValue(value: string): string {
		return value.toLowerCase().replace(/\s/g, '');
	}
}

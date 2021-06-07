import {
	ProvinceState,
	ProvinceStateModel
} from './../../../../shared/state/province/province.state';
import { CarStateModel } from './../../../../shared/state/car/car.state';
import { ProvinceService } from './../../../../shared/services/province.service';
import { Observable } from 'rxjs';

import { Select, Selector } from '@ngxs/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICar } from './../../../../shared/models/car.model';
import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { CarState } from 'src/app/shared/state/car/car.state';

@Component({
	selector: 'app-car-info',
	templateUrl: './car-info.component.html',
	styleUrls: [ './car-info.component.scss' ]
})
export class CarInfoComponent implements OnInit {
	@Input() title: string;
	@Input() car: ICar;

	@Select(CarState) car$: Observable<CarStateModel>;
	@Select(ProvinceState) province$: Observable<ProvinceStateModel>;

	stateEdit = false;

	carInfoForm: FormGroup;

	constructor(
		protected ref: NbDialogRef<CarInfoComponent>,
		private formBuilder: FormBuilder,
		private province: ProvinceService
	) {
		this.carInfoForm = this.formBuilder.group({
			id: [ '' ],
			plateLCN: [ '', Validators.required ],
			plateLCP: [ '' ],
			typeId: [ '' ]
		});
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

		this.province$.subscribe(console.log);
	}

	onSubmitCarInfo(): void {
		this.ref.close(this.carInfoForm.value);
	}

	onClose(): void {
		this.ref.close(null);
	}
}

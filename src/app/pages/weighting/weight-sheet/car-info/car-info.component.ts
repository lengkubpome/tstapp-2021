import { ProvinceService } from './../../../../shared/services/province.service';
import { Observable } from 'rxjs';
import {
	CarTypeState,
	CarTypeStateModel
} from './../../../../shared/state/car-type/car-type.state';
import { Select } from '@ngxs/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICar } from './../../../../shared/models/car.model';
import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
	selector: 'app-car-info',
	templateUrl: './car-info.component.html',
	styleUrls: [ './car-info.component.scss' ]
})
export class CarInfoComponent implements OnInit {
	@Input() title: string;
	@Input() car: ICar;

	@Select(CarTypeState) carTypes$: Observable<CarTypeStateModel>;

	stateEdit = false;

	carInfoForm: FormGroup;

	carTypes = [
		{ value: 'pickup-truck', title: 'กระบะ' },
		{ value: 'mini-truck', title: 'รถบรรทุกเล็ก' },
		{ value: 'truck', title: 'รถบรรทุก (6 - 12 ล้อ)' },
		{ value: 'tractor', title: 'รถแทรกเตอร์ (หัวลาก)' },
		{ value: 'trailer', title: 'พ่วงคอก (หาง)' },
		{ value: 'flatbed-trailer', title: 'พ่วงพื้นเรียบ (หาง)' },
		{ value: 'motorcycle-truck', title: 'มอเตอร์ไซค์พ่วง' },
		{ value: 'etc', title: 'อื่นๆ' }
	];

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

		this.province.getProvince();
	}

	onSubmitCarInfo(): void {
		this.ref.close(this.carInfoForm.value);
	}

	onClose(): void {
		this.ref.close(null);
	}
}

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

	canEdit = false;
	editState = false;
	hasUpdate = false;

	carInfoForm: FormGroup;

	constructor(
		protected ref: NbDialogRef<CarInfoComponent>,
		private formBuilder: FormBuilder
	) {
		this.carInfoForm = this.formBuilder.group({
			id: [ Validators.required ],
			plateLCN: [],
			plateLCP: [],
			type: []
		});
	}

	ngOnInit(): void {
		if (this.car.id !== 'NEW') {
			this.canEdit = true;
			this.editState = false;
			this.carInfoForm.get('id').setValue(this.car.id);
			this.carInfoForm.get('plateLCN').setValue(this.car.plateLCN);
			this.carInfoForm.get('plateLCP').setValue(this.car.plateLCP);
			this.carInfoForm.get('type').setValue(this.car.type);
		} else {
			this.canEdit = false;
			this.editState = true;
			this.carInfoForm.get('id').setValue(this.car.id);
			this.carInfoForm.get('plateLCN').setValue(this.car.plateLCN);
		}
	}

	onSubmitCarInfo(): void {
		if (this.canEdit) {
			this.editState = false;
			this.saveCar();
		} else {
			this.ref.close(this.carInfoForm.value);
		}
	}

	saveCar(): void {
		this.hasUpdate = true;
		//TODO: บันทึกข้อมูลเข้าฐานข้อมูล
	}

	onClose(): void {
		if (this.hasUpdate) {
			this.ref.close(this.carInfoForm.value);
		} else {
			this.ref.close(null);
		}
	}
}

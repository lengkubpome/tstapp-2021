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

	constructor(protected ref: NbDialogRef<CarInfoComponent>) {}

	ngOnInit(): void {
		console.log(this.ref);
	}

	cancel(): void {
		this.ref.close();
	}
}

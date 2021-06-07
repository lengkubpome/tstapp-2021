import { CarService } from './../../shared/services/car.service';
import { ProvinceService } from './../../shared/services/province.service';
import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';

@Component({
	selector: 'app-weighting',
	templateUrl: './weighting.component.html',
	styleUrls: [ './weighting.component.scss' ]
})
export class WeightingComponent implements OnInit {
	constructor(
		private carService: CarService,
		private proviceService: ProvinceService
	) {}
	ngOnInit(): void {
		// this.proviceService.getProvince().subscribe((data) => {
		// 	const type = data;
		// 	console.log(type);
		// });
	}
}

import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-weighting-in',
	templateUrl: './weighting-in.component.html',
	styleUrls: [ './weighting-in.component.scss' ]
})
export class WeightingInComponent implements OnInit {
	@Input() showVisitorsStatistics: boolean = false;

	constructor() {}

	ngOnInit(): void {}

	toggleStatistics(): void {
		this.showVisitorsStatistics = !this.showVisitorsStatistics;
	}
}

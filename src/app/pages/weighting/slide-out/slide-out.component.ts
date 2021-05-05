import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'ngx-slide-out',
	templateUrl: './slide-out.component.html',
	styleUrls: [ './slide-out.component.scss' ]
})
export class SlideOutComponent implements OnInit {
	@Input() showVisitorsStatistics = false;

	ngOnInit(): void {}

	toggleStatistics(): void {
		this.showVisitorsStatistics = !this.showVisitorsStatistics;
	}
}

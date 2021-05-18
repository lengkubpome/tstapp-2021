import {
	debounceTime,
	distinctUntilChanged,
	map,
	startWith
} from 'rxjs/operators';
import { OperatorFunction, Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'app-weighting',
	templateUrl: './weighting.component.html',
	styleUrls: [ './weighting.component.scss' ]
})
export class WeightingComponent implements OnInit {
	constructor() {}
	ngOnInit(): void {}
}

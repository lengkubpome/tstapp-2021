import { WeightingState, WeightingStateModel } from "./state/weighting.state";
import { IWeightingType } from "./../../shared/models/weighting.model";
import { Store } from "@ngxs/store";
import { Component, OnInit } from "@angular/core";

@Component({
	selector: "app-weighting",
	template: `
		<div class="row">
			<div class="col-lg-8">
				<app-weight-sheet></app-weight-sheet>
			</div>
			<div class="col-lg-4">
				<app-weight-storage></app-weight-storage>
			</div>
		</div>
	`,
})
export class WeightingComponent implements OnInit {
	weightingTypes: IWeightingType[];

	constructor(private store: Store) {
		this.weightingTypes =
			this.store.selectSnapshot<WeightingStateModel>(
				WeightingState
			).weightingTypes;
	}
	ngOnInit(): void {}
}

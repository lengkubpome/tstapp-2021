import { WeightingState, WeightingStateModel } from './state/weighting.state';
import { IWeightingType } from './../../shared/models/weighting.model';
import { Store } from '@ngxs/store';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-weighting',
  templateUrl: './weighting.component.html',
  styleUrls: ['./weighting.component.scss'],
})
export class WeightingComponent implements OnInit {
  weightingTypes: IWeightingType[];

  constructor(private store: Store) {
    this.weightingTypes = this.store.selectSnapshot<WeightingStateModel>(WeightingState).weightingTypes;
  }
  ngOnInit(): void {}
}

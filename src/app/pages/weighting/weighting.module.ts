import { WeightingComponent } from './weighting.component';
import { NbCardModule, NbButtonModule } from '@nebular/theme';
import { ThemeModule } from './../../@theme/theme.module';
import { NgModule } from '@angular/core';

@NgModule({
	declarations: [ WeightingComponent ],
	imports: [ ThemeModule, NbCardModule, NbButtonModule ],
	exports: [],
	providers: []
})
export class WeightingModule {}

import { SlideOutComponent } from './slide-out/slide-out.component';
import { WeightingInComponent } from './weighting-in/weighting-in.component';
import { RouterModule, Routes } from '@angular/router';
import { WeightingComponent } from './weighting.component';
import {
	NbCardModule,
	NbButtonModule,
	NbSidebarModule,
	NbLayoutModule,
	NbIconModule,
	NbInputModule,
	NbFormFieldModule,
	NbButtonGroupModule,
	NbRadioModule
} from '@nebular/theme';
import { ThemeModule } from './../../@theme/theme.module';
import { NgModule } from '@angular/core';
import { NgbTypeahead, NgbModule } from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
	{
		path: '',
		component: WeightingComponent
	}
];

@NgModule({
	declarations: [ WeightingComponent, WeightingInComponent, SlideOutComponent ],
	imports: [
		RouterModule.forChild(routes),
		NbSidebarModule,
		ThemeModule,
		NbCardModule,
		NbButtonModule,
		NbLayoutModule,
		NbCardModule,
		NbButtonModule,
		NbIconModule,
		NbInputModule,
		NbFormFieldModule,
		NbButtonGroupModule,
		NbRadioModule,
		NgbModule
		// NgbTypeahead
	],
	exports: [],
	providers: []
})
export class WeightingModule {}

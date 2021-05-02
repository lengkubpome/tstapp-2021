import { RouterModule, Routes } from '@angular/router';
import { WeightingComponent } from './weighting.component';
import {
	NbCardModule,
	NbButtonModule,
	NbSidebarModule,
	NbLayoutModule
} from '@nebular/theme';
import { ThemeModule } from './../../@theme/theme.module';
import { NgModule } from '@angular/core';

const routes: Routes = [
	{
		path: '',
		component: WeightingComponent
	}
];

@NgModule({
	declarations: [ WeightingComponent ],
	imports: [
		RouterModule.forChild(routes),
		NbSidebarModule,
		ThemeModule,
		NbCardModule,
		NbButtonModule,
		NbLayoutModule,
		NbCardModule
	],
	exports: [],
	providers: []
})
export class WeightingModule {}

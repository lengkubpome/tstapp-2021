import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
	NbRadioModule,
	NbTabsetModule,
	NbSelectModule,
	NbContextMenuModule
} from '@nebular/theme';
import { ThemeModule } from './../../@theme/theme.module';
import { NgModule } from '@angular/core';
// import { Ng2SmartTableModule } from 'ng2-smart-table';

const routes: Routes = [
	{
		path: '',
		component: WeightingComponent
	}
];

@NgModule({
	declarations: [ WeightingComponent, WeightingInComponent, SlideOutComponent ],
	imports: [
		FormsModule,
		ReactiveFormsModule,
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
		NbTabsetModule,
		NbSelectModule,
		NbContextMenuModule,
		MatAutocompleteModule,
		MatFormFieldModule,
		NgbModule
	],
	exports: [],
	providers: []
})
export class WeightingModule {}

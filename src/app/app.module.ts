import { ThemeModule } from './@theme/theme.module';
import { CoreModule } from './@core/core.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
	NbThemeModule,
	NbLayoutModule,
	NbSidebarModule,
	NbMenuModule,
	NbDatepickerModule,
	NbDialogModule,
	NbWindowModule,
	NbToastrModule
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
	declarations: [ AppComponent ],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		NbThemeModule.forRoot(),
		NbLayoutModule,
		NbEvaIconsModule,
		AppRoutingModule,
		NbLayoutModule,
		NbSidebarModule.forRoot(),
		NbMenuModule.forRoot(),
		NbDatepickerModule.forRoot(),
		NbDialogModule.forRoot(),
		NbWindowModule.forRoot(),
		NbToastrModule.forRoot(),
		CoreModule.forRoot(),
		ThemeModule.forRoot()
	],
	providers: [],
	bootstrap: [ AppComponent ]
})
export class AppModule {}

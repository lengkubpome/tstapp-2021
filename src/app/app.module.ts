import { environment } from './../environments/environment.prod';
import { stateList } from './shared/state';
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
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
	declarations: [ AppComponent ],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
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
		ThemeModule.forRoot(),
		// NGXS
		NgxsModule.forRoot([ ...stateList ], {
			developmentMode: !environment.production
		}),
		NgxsLoggerPluginModule.forRoot(),
		NgxsReduxDevtoolsPluginModule.forRoot()
		// Another
	],
	providers: [],
	bootstrap: [ AppComponent ]
})
export class AppModule {}

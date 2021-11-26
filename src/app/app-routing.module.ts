import { NgModule } from '@angular/core';

import { Routes, RouterModule, ExtraOptions } from '@angular/router';

const routes: Routes = [
	{
		path: 'pages',
		loadChildren: () =>
			import('./pages/pages.module').then((m) => m.PagesModule)
	},
	{ path: '', redirectTo: 'pages', pathMatch: 'full' },
	{ path: 'contact', loadChildren: () => import('./pages/contact/contact.module').then(m => m.ContactModule) },
	{ path: '**', redirectTo: 'pages' }
];

const config: ExtraOptions = {
	useHash: false
};

@NgModule({
	imports: [ RouterModule.forRoot(routes, config) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule {}

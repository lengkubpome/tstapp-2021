import { ContactListComponent } from "./contact-list/contact-list.component";
import { Routes, RouterModule } from "@angular/router";
import { ContactDetailComponent } from "./contact-detail/contact-detail.component";

const routes: Routes = [
	{
		path: "",
		component: ContactListComponent,
		// children: [
		// 	{
		// 		path: "det",
		// 		component: ContactDetailComponent,
		// 	},
		// 	// {
		// 	// 	path: "new",
		// 	// 	component: ContactNewComponent,
		// 	// },
		// ],
	},
	{
		path: ":id",
		component: ContactDetailComponent,
	},
];

export const ContactRoutes = RouterModule.forChild(routes);

import { Subject } from 'rxjs';
import { Store } from '@ngxs/store';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { IContact } from 'src/app/shared/models/contact.model';
import { Component, OnInit, Input } from '@angular/core';

import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
	selector: 'app-contact-info',
	templateUrl: './contact-info.component.html',
	styleUrls: [ './contact-info.component.scss' ]
})
export class ContactInfoComponent implements OnInit {
	@Input() title: string;
	@Input() contact: IContact;

	carInfoForm: FormGroup;
	// Private
	private unsubscribeAll: Subject<any>;

	constructor(
		protected ref: NbDialogRef<ContactInfoComponent>,
		private fb: FormBuilder,
		private store: Store,
		private matIconRegistry: MatIconRegistry,
		private domSanitizer: DomSanitizer
	) {
		this.carInfoForm = this.fb.group({
			id: [ '' ],
			name: [ '' ]
		});

		this.unsubscribeAll = new Subject();

		this.matIconRegistry.addSvgIcon(
			`icon_line`,
			this.domSanitizer.bypassSecurityTrustResourceUrl(
				'../../../../assets/images/line.svg'
			)
		);
	}

	ngOnInit(): void {}

	onClose(): void {
		this.ref.close(null);
	}

	onSubmitContactInfo() {}
}

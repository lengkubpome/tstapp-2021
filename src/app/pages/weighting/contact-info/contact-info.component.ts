import { Subject } from 'rxjs';
import { Store } from '@ngxs/store';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { IContact } from 'src/app/shared/models/contact.model';
import { Component, OnInit, Input } from '@angular/core';

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
		private store: Store
	) {
		this.carInfoForm = this.fb.group({
			id: [ '' ],
			firstName: [ '' ],
			lastName: [ '' ]
		});

		this.unsubscribeAll = new Subject();
	}

	ngOnInit(): void {}

	onClose(): void {
		this.ref.close(null);
	}

	onSubmitContactInfo() {}
}

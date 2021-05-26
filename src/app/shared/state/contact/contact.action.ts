import { IContact } from './../../models/contact.model';

// tslint:disable-next-line:no-namespace
export namespace ContactAction {
	export class FetchAll {
		static readonly type = '[Contact] Fetch All';
	}

	export class Add {
		static readonly type = '[Contact] Add';

		constructor(public payload: IContact) {}
	}

	export class Edit {
		static readonly type = '[Contact] Edit';

		constructor(public payload: IContact, public id: string) {}
	}

	export class Delete {
		static readonly type = '[Contact] Delete';

		constructor(public id: string) {}
	}
}

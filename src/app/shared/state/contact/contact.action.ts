import { IContact } from "./../../models/contact.model";

// tslint:disable-next-line:no-namespace
export namespace ContactAction {
	export class FetchAll {
		static readonly type = "[Contact] Fetch All";
	}

	export class SelectContact {
		static readonly type = "[Contact] Select Detail";
		constructor(public readonly contactId: string) {}
	}

	export class Add {
		static readonly type = "[Contact] Add";

		constructor(public contact: IContact, public profileImage?: any) {}
	}

	export class Edit {
		static readonly type = "[Contact] Edit";

		constructor(public payload: IContact, public id: string) {}
	}

	export class Delete {
		static readonly type = "[Contact] Delete";

		constructor(public id: string) {}
	}
}

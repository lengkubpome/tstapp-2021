import { ICar } from './../../models/car.model';

// tslint:disable-next-line:no-namespace
export namespace CarAction {
	export class FetchAll {
		static readonly type = '[Car] Fetch All';
	}

	export class Add {
		static readonly type = '[Car] Add';

		constructor(public payload: ICar) {}
	}

	export class Edit {
		static readonly type = '[Car] Edit';

		constructor(public payload: ICar, public id: string) {}
	}

	export class Delete {
		static readonly type = '[Car] Delete';

		constructor(public id: string) {}
	}

	export class FetchOwners {
		static readonly type = '[Car] Fetch Contact All';

		constructor(public payload: ICar, public id: string) {}
	}
}

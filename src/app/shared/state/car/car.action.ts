import { Car } from './../../models/car.model';

// tslint:disable-next-line:no-namespace
export namespace CarAction {
	export class FetchAll {
		static readonly type = '[Car] Fetch All';
	}

	export class Add {
		static readonly type = '[Car] Add';

		constructor(public payload: Car) {}
	}

	export class Edit {
		static readonly type = '[Car] Edit';

		constructor(public payload: Car, public id: number) {}
	}

	export class Delete {
		static readonly type = '[Car] Delete';

		constructor(public id: number) {}
	}
}

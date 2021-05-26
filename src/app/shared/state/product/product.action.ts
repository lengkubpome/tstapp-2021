import { IProduct } from './../../models/product.model';

// tslint:disable-next-line:no-namespace
export namespace ProductAction {
	export class FetchAll {
		static readonly type = '[Product] Fetch All';
	}

	export class Add {
		static readonly type = '[Product] Add';

		constructor(public payload: IProduct) {}
	}

	export class Edit {
		static readonly type = '[Product] Edit';

		constructor(public payload: IProduct, public id: number) {}
	}

	export class Delete {
		static readonly type = '[Product] Delete';

		constructor(public id: number) {}
	}
}

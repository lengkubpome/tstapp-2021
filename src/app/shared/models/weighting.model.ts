import { IProduct } from './product.model';
import { IContact } from './contact.model';
import { ICar } from './car.model';
export interface IWeighting {
	id?: string;
	status:
		| 'success'
		| 'voided'
		| 'await-payment'
		| 'check-out'
		| 'check-in'
		| null;
	type?: string;
	car?: ICar;
	contact?: IContact; // Contact;
	destination?: string;
	product?: IProduct; // Product;
	price?: number;
	wIn?: {
		dateTime: Date;
		weight: number;
	};
	wOut?: {
		dateTime: Date;
		weight: number;
	};
	weight?: number;
	weightCut?: string;
	weightNet?: number;
	amountNet?: number;
	notes?: string;
	payment?: IPaymentWeighting[];
}

export interface IPaymentWeighting {
	date: Date;
	payAccountId: string;
	amount: number;
	note: string;
}

const WeightingDefault: IWeighting = {
	status: null
};

export class Weighting {
	private weighting: IWeighting;

	constructor() {
		this.weighting.status = null;
	}

	public getWeighting(): IWeighting {
		return this.weighting;
	}

	public getStatus(): string {
		return this.weighting.status;
	}

	public checkIn(): void {}
	public checkOut(): void {}
}

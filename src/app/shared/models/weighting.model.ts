export interface Weighting {
	id: string;
	status: string;
	type: string;
	car: Car;
	contact: Contact;
	product: Product;
	wIn: {
		dateTime: Date;
		weight: number;
	};
	wOut: {
		dateTime: Date;
		weight: number;
	};
	weight: number;
	weightCut: {
		amount: number;
		unit: 'kg' | '%';
	};
	weightNet: number;
	amountNet: number;
	comment: string;
	payment: Payment[];
}

export interface Payment {
	id: string;
	bankAccount: BankAccount;
	amount: number;
}

export interface BankAccount {
	id: string;
	name: string;
	bankName: string;
	accountName: string;
	accountNumber: string;
}
export interface Car {
	id: string;
	plateLCN: string; // Plate License Number
	plateLCP?: string; // Plate License Province
	ownerContact?: Contact;
}

export interface Contact {
	id: string;
	firstName: string;
	lastName?: string;
}

export interface Product {
	id: string;
	name: string;
	price: number;
}

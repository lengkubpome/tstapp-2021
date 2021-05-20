export interface Business {
	name: string;
	address: string;
	taxId: string;
	phone: string;
	payment: BusinessPaymentMethod[];
}

export interface BusinessPaymentMethod {
	id: string;
	type: 'cash' | 'bank';
	name: string;
	memo?: string;
	balance: number;
	bankAccount: {
		bankName: string;
		accountType: 'saving account' | 'current account';
		accountName: string;
		accountNumber: string;
	};
}

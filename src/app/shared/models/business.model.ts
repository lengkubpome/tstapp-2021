export interface IBusiness {
	id: string;
	name: string;
	address: string;
	taxId: string;
	phone: string;
	payment: IBusinessPaymentMethod[];
}

export interface IBusinessPaymentMethod {
	id: string;
	type: "cash" | "bank";
	name: string;
	memo?: string;
	balance: number;
	bankAccount: {
		bankName: string;
		accountType: "saving account" | "current account";
		accountName: string;
		accountNumber: string;
	};
}

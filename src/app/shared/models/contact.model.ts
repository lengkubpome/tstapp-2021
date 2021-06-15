import { ICar } from './car.model';

export interface IContact {
	id: string;
	businessType: string; // 'Individual'|'Corporate';
	name: string;
	taxId: string;
	type: {
		vendor: boolean;
		customer: boolean;
		// employee: boolean;
	};
	branchCode?: string;
	individual?: {
		prefixName?: string;
		firstName: string;
		lastName: string;
		birthDate?: Date;
	};
	address?: IAddress;
	shippingAddress?: IAddress;

	primaryContactName?: string;
	communicates?: {
		phone1: string; // 'phone' | 'email' | 'line' | 'Web'
		phone2?: string;
		email?: string;
		lineId?: string;
	};

	profileImageUrl?: any;
	bankAccount?: IBankAccount;
	carList?: ICar[];
}

export interface IBankAccount {
	accountType: string;
	accountName: string;
	accountNumber: number;
	bankName: string;
}

interface IAddress {
	line: string;
	subDistrict: string;
	district: string;
	province: string;
	postCode: string;
}

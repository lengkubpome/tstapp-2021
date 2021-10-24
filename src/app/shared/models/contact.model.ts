import { ICar } from './car.model';

export interface IContact {
	id: string;
	type: string; // 'Individual'|'Corporate' => เลือกประเภทได้เลย;
	displayName: string;
	taxId?: string;
	isVendor: boolean;
	isCustomer: boolean;

	corporateInfo?: {
		type: string;
		companyName?: string;
		branchCode?: string;
	};

	personalInfo?: {
		title?: string;
		firstName?: string;
		lastName?: string;
	};

	address?: IAddress;

	shippingAddress?: {
		address?: IAddress;
		isSameAddress: boolean;
	};

	communicateInfo?: {
		phone1: string; // 'phone' | 'email' | 'line' | 'Web'
		phone2?: string;
		line1?: {
			displayName: string;
			userId: string;
		};
		line2?: {
			displayName: string;
			userId: string;
		};
		email?: string;
	};

	bankAccounts?: IBankAccount[];

	linkContactId?: string; // เชื่อมกับร้านค้า
	memberClassId?: string;

	locationGoogle?: { lat: number; lng: number };
	profileImageUrl?: any;
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
	country?: string;
	postCode?: string;
}

export interface IMemberClass {
	id: string;
	name: string;
	description: string;
}

// export interface IContact1 {
// 	id: string;
// 	businessType: string; // 'Individual'|'Corporate';
// 	name: string;
// 	taxId: string;
// 	type: {
// 		vendor: boolean;
// 		customer: boolean;
// 		// employee: boolean;
// 	};
// 	branchCode?: string;
// 	individual?: {
// 		prefixName?: string;
// 		firstName: string;
// 		lastName: string;
// 		birthDate?: Date;
// 	};
// 	address?: IAddress;
// 	shippingAddress?: IAddress;

// 	primaryContactName?: string;
// 	communicates?: {
// 		phone1: string; // 'phone' | 'email' | 'line' | 'Web'
// 		phone2?: string;
// 		email?: string;
// 		lineId?: string;
// 	};

// 	profileImageUrl?: any;
// 	bankAccount?: IBankAccount;
// 	carList?: ICar[];
// }

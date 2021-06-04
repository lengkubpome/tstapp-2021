import { IContact } from './contact.model';
import { Observable } from 'rxjs';
export interface ICar {
	id: string;
	plateLCN: string; // Plate License Number
	plateLCP?: string; // Plate License Province
	typeId?: string;
}

export interface ICarType {
	id: string;
	th: string;
	en: string;
}

export interface ICarContact {
	car: ICar;
	contact: IContact;
	frequency: number;
}

export abstract class CarData {
	abstract getCars(): Observable<ICar[]>;
}

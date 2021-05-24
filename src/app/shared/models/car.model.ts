import { Observable } from 'rxjs';
export interface Car {
	id: string;
	plateLCN: string; // Plate License Number
	plateLCP?: string; // Plate License Province
	ownerContactId?: string;
}

export abstract class CarData {
	abstract getCars(): Observable<Car[]>;
}

import { Observable, of } from 'rxjs';
import { WeightingModule } from './weighting.module';
import { Injectable } from '@angular/core';
import { IWeighting } from 'src/app/shared/models/weighting.model';

@Injectable({
	providedIn: WeightingModule
})
export class WeightingService {
	private data: IWeighting[] = [];
	constructor() {}

	fetchAll(): Observable<IWeighting[]> {
		return of(this.data);
	}

	fetchByDate(date: Date): Observable<IWeighting[]> {
		return of(this.data.filter((d) => d.wIn.dateTime));
	}

	generateId(): string {
		const now = new Date();
		let timestamp = now.getFullYear().toString(); // 2011
		timestamp +=
			(now.getMonth() + 1 < 9 ? '0' : '') + (now.getMonth() + 1).toString(); // 0=January, 1=February
		timestamp += (now.getDate() < 10 ? '0' : '') + now.getDate().toString(); // pad with a 0

		const order = this.data.filter((d) => d.wIn.dateTime).length + 1;
		timestamp +=
			(order < 100 ? '0' : '') + (order < 10 ? '0' : '') + order.toString();
		return timestamp;
	}
}

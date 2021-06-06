import { distinct, filter, map, take } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface IProvince {
	id: string;
	zip: string;
	province: string;
	district: string;
	lat: number;
	lng: number;
}

@Injectable({
	providedIn: 'root'
})
export class ProvinceService {
	constructor(private http: HttpClient) {}

	getProvince(): Observable<string[]> {
		const res = this.http.get('assets/data/province.json').pipe(
			map((data: IProvince[]) => {
				const vaulesAlreadySeen = [];
				for (const p of data) {
					const value = p;
					if (vaulesAlreadySeen.indexOf(value.province) === -1) {
						vaulesAlreadySeen.push(value.province);
					}
				}
				return vaulesAlreadySeen;
			})
		);
		return res;
	}
}

import { distinct, filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

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

	getProvince(): any {
		this.http
			.get('assets/data/province.json')
			.pipe(distinct((data: IProvince) => data.province))
			.subscribe(console.log);
		// console.log('xxxxxx');
		return false;
	}
}

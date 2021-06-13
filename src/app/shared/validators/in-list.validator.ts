import { AbstractControl, ValidatorFn } from '@angular/forms';

export function inList(list: any[], findInProperties?: string[]): ValidatorFn {
	return (control: AbstractControl): { [key: string]: any } | null => {
		let result = null;
		if (control.value) {
			if (!findInProperties) {
				result = list.find((item) => item === control.value)
					? null
					: { notInList: control.value };
			} else if (typeof control.value === 'string') {
				let isInList = false;
				list.forEach((obj) => {
					let value = '';

					findInProperties.forEach((key) => {
						if (key in obj) {
							value = value + obj[key];
						}
					});

					if (value.replace(/\s/g, '') === control.value.replace(/\s/g, '')) {
						isInList = true;
					}
				});

				if (!isInList) {
					result = { notInList: control.value };
				}
			} else {
				result = { ...result, error: ' value is not string' };
			}
		}
		console.log(result);

		return result;
	};
}

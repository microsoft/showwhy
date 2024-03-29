/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

function isStringNan(n: string | number | null): boolean {
	return typeof n === 'string' && n === 'nan'
}

export function nanToNull(result: Record<string, any>, property: string) {
	if (result.hasOwnProperty(property)) {
		const { covariate_balance: covariateBalance } = result
		let updated_cov = {}

		for (const key in covariateBalance) {
			const obj = { ...covariateBalance[key] }
			for (const k in obj) {
				if (isStringNan(obj[k] as string | number | null)) {
					obj[k] = null
				} else {
					obj[k] = obj[k] as number
				}
			}
			updated_cov = { ...updated_cov, [key]: obj }
		}
		return {
			...result,
			covariate_balance: updated_cov,
		}
	}
	return result
}

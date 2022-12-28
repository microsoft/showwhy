/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export interface SelectorProps {
	units: string[]
	minDate: number
	maxDate: number
	treatmentStartDate: number
	treatedUnit: string
	onTreatmentDateChange: (treatmentDate: number, treatedUnit: string) => void
	onTreatedUnitChange: (oldTreatedUnit: string, newTreatedUnit: string) => void
	onDelete: (treatedUnit: string) => void
}

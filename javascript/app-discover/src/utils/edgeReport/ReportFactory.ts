/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DECIReportGenerator } from '../edgeReport/DECIReportGenerator.js'
import { CausalDiscoveryAlgorithm } from './../../domain/CausalDiscovery/CausalDiscoveryAlgorithm.js'
import { PCReportGenerator } from './PCReportGenerator.js'
import { ReportGenerator } from './ReportGenerator.js'

export const reportFactory = (algorithm: CausalDiscoveryAlgorithm) => {
	switch (algorithm) {
		case CausalDiscoveryAlgorithm.DECI:
			return new DECIReportGenerator()
		case CausalDiscoveryAlgorithm.PC:
			return new PCReportGenerator()
		default:
			return new ReportGenerator()
	}
}

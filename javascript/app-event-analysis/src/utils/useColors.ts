/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Theme } from '@thematic/core'
import { useThematic } from '@thematic/react'
import { useMemo } from 'react'

export function useLineColors() {
	const theme = useThematic()
	return useMemo(() => getLineStroke(theme), [theme])
}

function getLineStroke(theme: Theme) {
	// use the main line props for primary line,
	// use the scales to extract secondary or tertiary colors
	// TODO: we need a secondary color in thematic so we don't need to use the nominal scale
	const scale = theme.scales().nominal()
	return {
		// return semantically named colors
		get: (name: string) => {
			switch (name) {
				case 'treated':
				case 'mean treated':
				case 'relative':
					return theme.line().stroke().hex()
				case 'synthetic control':
				case 'mean synthetic':
				case 'control':
				case 'reference':
					return scale(1).hex()
				default:
					return theme.text().fill().hex()
			}
		},
		// fixed static colors (e.g., chart chrome, etc.)
		defaultAxisTitle: theme.axisTitle().fill().hex(),
		arrowFill: theme.flow().stroke().hex(),
		arrowStroke: theme.flow().stroke().hex(),
		circleFill: theme.circle().fill().hex(),
		timeMarker: theme.process().fill().hex(),
		counterfactual: theme.link().stroke().hex(),
		gridLine: theme.gridLines().stroke().hex(0.5),
		treatmentLine: scale(4).hex(),
		counterfactualLine: theme.link().stroke().hex(),
		control: theme.link().stroke().hex(),
	}
}

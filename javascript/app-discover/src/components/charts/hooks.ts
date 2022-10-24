/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useThematic } from '@thematic/react'
import { vega } from '@thematic/vega'
import { useMemo } from 'react'
import type { VisualizationSpec } from 'react-vega'
import type { Spec } from 'vega'

export function useVegaSpec(config: VisualizationSpec): VisualizationSpec {
	const theme = useThematic()
	return useMemo(() => {
		const spec = vega(theme, config as Spec)
		// HACK: these are overrides to clean up the charts from the defaults
		// the original specs were vega-lite, which doesn't have as much customization
		// so this is a temporary detailed config to patch up the charts as a whole
		if (spec.config?.rect) {
			spec.config.rect.stroke = theme.plotArea().fill().hex()
		}
		return spec
	}, [theme, config])
}

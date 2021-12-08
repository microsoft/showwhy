/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { isArray, merge, mergeWith } from 'lodash'
import { Children, useMemo } from 'react'
import { Spec } from 'vega'

/**
 * Lodash merge customizer to ensure that arrays are note overwritten, but rather concatenated.
 * In Vega, most root properties are arrays (data, signals, axes, etc.), so we want to concat
 * if we're allowing composition from multiple specs.
 * @param objValue
 * @param srcValue
 * @returns
 */
function customizer(objValue, srcValue) {
	if (isArray(objValue)) {
		return objValue.concat(srcValue)
	}
}

/**
 * Take a base spec and any child components with type-specific specs, and merge them together.
 * @param spec
 * @param children
 */
// ReactChildren doesn't type correctly with props
// eslint-disable-next-line
export function useMergeChildSpecs(spec: Spec, children: any): Spec {
	return useMemo(() => {
		let merged = merge({}, spec)
		Children.forEach(children, child => {
			merged = mergeWith(merged, child.props.spec, customizer)
		})
		return merged
	}, [spec, children])
}

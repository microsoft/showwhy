/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { JSONPath } from 'jsonpath-plus'
import { merge, set } from 'lodash'

/**
 * This performs a specification merge with Vega.
 * It operates like lodash merge, but specifically uses
 * keys for array merges to ensure that they match up correctly.
 * This means you don't need to know the array position for what
 * you're sending overrides to, you can just specify the name.
 * Note that there are some built-in Vega JS API utils that do
 * similar (mergeConfig), but don't seem to quite line up with these goals.
 * @param input
 * @param overlay
 */
// eslint-disable-next-line
export function mergeSpec(input: any, overlay: any): any {
	// TODO: investigate using vega merge util?
	return merge(input, overlay)
}

/**
 * The PathSpec is just an object, where the keys are the JSONPAth strings to set on the Vega spec object.
 * This extends the ability of _.merge, which just uses array indexes.
 * Examples:
 *  '$.data[?(@.name == \'source\')].values': <some data>
 *  '$.marks[?(@.name == \'effects\')].encode.update.fill.value': 'blue'
 */
export interface PathSpec {
	// eslint-disable-next-line
	[key: string]: any
}

/**
 * Parses a PathSpec into a new object with values, suitable for merging with _.merge.
 * Due to use of JSONPath, this supports queries into arrays.
 * @param input
 * @param pathSpec
 * @returns
 */
// TODO: the matchable part does not appear to enforce nesting limitations
// e.g., if two marks arrays exist, you can match marks in the nested array without a selector for the parent
// eslint-disable-next-line
export function parseJsonPathSpec(input: any, pathSpec: PathSpec): any {
	// eslint-disable-next-line
	const output: any = {}

	// for each JSONPath string, we basically flipflop through formats to check how far
	// we can match, and then construct a final path to use for setting the value.
	// this means we can create new subobjects, as long as some parent part of the path is matchable.
	// TODO: utility that merges JSONPath + _.set for new creation
	Object.entries(pathSpec).forEach(([key, value]) => {
		const parts = JSONPath.toPathArray(key)

		// progressively build up a match from the parts, until we no longer get a hit
		// this will reveal the matchable part of the path, which we can then use JSONPath
		// to substitute queries, etc. for final pointers in the vega spec
		const matchable = parts.reduce(
			// eslint-disable-next-line
			(acc: any, cur: string) => {
				// once we determine we miss a match, ignore the rest
				if (acc.done) {
					return acc
				}
				const path = JSONPath.toPathString([...acc.parts, cur])
				const match = JSONPath({
					path,
					json: input,
					wrap: false,
				})
				if (match) {
					return {
						parts: [...acc.parts, cur],
						done: false,
					}
				}
				return {
					...acc,
					done: true,
				}
			},
			{
				parts: [],
				done: false,
			},
		).parts

		// any leftover parts of the path
		const remainder = parts.slice(matchable.length)

		// this gives us a valid result from the matchable part, which we then use to reconstruct a new pointer
		const result = JSONPath({
			path: matchable,
			json: input,
			resultType: 'path',
		})

		const start = JSONPath.toPathArray(result[0])
		const rejoined = [...start, ...remainder]
		const pointer = JSONPath.toPointer(rejoined)

		// the pointer uses slashes to delimit levels. clear off the leading slash, replace digits with array indexes,
		// then replace the remaining slashes with dots: now we have an _.set compatible path string
		const path = pointer
			.replace(/\//, '')
			.replace(/\/(\d+)\//g, '[$1].')
			.replace(/\//g, '.')

		set(output, path, value)
	})

	return output
}

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { CausalFactorType } from '../types/causality/CausalFactorType.js'
import { DefinitionType } from '../types/experiments/DefinitionType.js'
import { pluralize } from './lang.js'

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return */
enum DataTypes {
	STRING = 'string',
	NUMBER = 'numerical',
	BOOLEAN = 'binary',
	CATEGORICAL = 'categorical',
}

export function getAcceptedDataType(
	type: DefinitionType | CausalFactorType,
): string[] {
	switch (type) {
		case DefinitionType.Population:
		case DefinitionType.Exposure:
			return [DataTypes.BOOLEAN]
		case DefinitionType.Outcome:
			return [DataTypes.NUMBER, DataTypes.BOOLEAN]
		case CausalFactorType.Confounders:
			return [DataTypes.NUMBER, DataTypes.BOOLEAN, DataTypes.CATEGORICAL]
		default:
			return []
	}
}

function nonNull(data: any[]): any[] {
	return data.filter(d => d !== null && d !== undefined)
}

function parseBoolean(value: any): boolean {
	if (typeof value === 'string') {
		value = value.toLowerCase()
	}
	switch (value) {
		case 'true':
		case '1':
		case 1:
			return true
		case 'false':
		case '0':
		case 0:
			return false
		default:
			return value
	}
}

function isBinary(data: any[]): boolean {
	const filtered = nonNull(data)
	return (
		!!filtered.length &&
		filtered.every(d => parseBoolean(d) === true || parseBoolean(d) === false)
	)
}
function isNumerical(data: any[]): boolean {
	const filtered = nonNull(data)
	return !!filtered.length && filtered.every(d => typeof d === 'number')
}
function isCategorical(): boolean {
	// TODO: Find out how to handle categorical data
	return true
}
function isString(data: any[]): boolean {
	const filtered = nonNull(data)
	return !!filtered.length && filtered.every(d => typeof d === 'string')
}
export function assert(data: any[], type: DataTypes): boolean {
	switch (type) {
		case DataTypes.STRING:
			return isString(data)
		case DataTypes.NUMBER:
			return isNumerical(data)
		case DataTypes.BOOLEAN:
			return isBinary(data)
		case DataTypes.CATEGORICAL:
			return isCategorical()
		default:
			return false
	}
}

export const assertDataType = {
	isBinary: (data: any[]): boolean => assert(data, DataTypes.BOOLEAN),
	isCategorical: (data: any[]): boolean => assert(data, DataTypes.CATEGORICAL),
	isNumerical: (data: any[]): boolean => assert(data, DataTypes.NUMBER),
	isString: (data: any[]): boolean => assert(data, DataTypes.STRING),
}

export function getColumnDataTypeWarning(
	column: string,
	type: DefinitionType | CausalFactorType,
): string {
	const accepted = getAcceptedDataType(type)
	const len = accepted.length
	if (!len) {
		return ''
	}
	return `The data type of ${column} is not valid for ${type}. Please change it to ${
		len === 1 ? 'the' : 'one of these'
	} allowed data type${pluralize(len)}: ${accepted.join(', ')}.`
}

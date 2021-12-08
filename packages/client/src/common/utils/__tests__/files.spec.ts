/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { extension, guessDelimiter } from '../files'

describe('extension file functions', () => {
	it('returns txt as extension extension', () => {
		const name = 'file.txt'
		const expected = 'txt'
		const result = extension(name)
		expect(result).toEqual(expected)
	})

	it('throws error when filename empty', () => {
		const error = 'Error retrieving file extension'
		expect(() => extension('')).toThrow(error)
	})
})

describe('guess delimiter file functions', () => {
	it('guess delimiter default', () => {
		const filename = 'filename.csv'
		const expected = ','
		const result = guessDelimiter(filename)
		expect(result).toEqual(expected)
	})
	it('guess delimiter tsv', () => {
		const filename = 'filename.tsv'
		const expected = '\t'
		const result = guessDelimiter(filename)
		expect(result).toEqual(expected)
	})
	it('guess delimiter txt', () => {
		const filename = 'filename.txt'
		const expected = '\t'
		const result = guessDelimiter(filename)
		expect(result).toEqual(expected)
	})
})

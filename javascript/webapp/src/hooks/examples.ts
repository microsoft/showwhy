/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useEffect, useState } from 'react'

export interface ExampleIndex {
	examples: FileDefinition[]
}
export interface FileDefinition {
	name: string
	url: string
}
const EMPTY_INDEX: ExampleIndex = {
	examples: [],
}

const EXAMPLES_PATH = 'data/examples/index.json'

export function useExampleProjects(): ExampleIndex {
	const [examples, setExamples] = useState<ExampleIndex>(EMPTY_INDEX)
	useEffect(() => {
		void fetch(EXAMPLES_PATH)
			.then(r => r.json())
			.then((e: ExampleIndex) => setExamples(e))
			.catch(err => {
				console.error('error loading examples', err)
				throw err
			})
	}, [setExamples])
	return examples
}

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IContextualMenuItem, IContextualMenuProps } from '@fluentui/react'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { useLoadProject } from '../hooks/loadProject.js'
import { useResetProject } from '../hooks/useResetProject.js'
import type { Handler1 } from '../types/primitives.js'
import type { FileDefinition } from '../types/workspace/FileDefinition.js'
import type { ProjectJson } from '../types/workspace/ProjectJson.js'

type OnClickHandler = Handler1<FileDefinition>
const EXAMPLES_PATH = 'data/examples/exposure/examples.json'

export function useExamplesMenu(): IContextualMenuProps {
	const exampleProjects = useExampleProjects()
	const onClickProject = useOnClickProject()

	return useMemo<IContextualMenuProps>(() => {
		const items: IContextualMenuItem[] = exampleProjects.map(example => ({
			key: example.url,
			text: example.name,
			onClick: () => onClickProject(example),
		}))

		return { items }
	}, [onClickProject, exampleProjects])
}

function useExampleProjects(): FileDefinition[] {
	const [examples, setExamples] = useState<FileDefinition[]>([])
	useEffect(() => {
		void fetch(EXAMPLES_PATH)
			.then(r => r.json())
			.then((e: FileDefinition[]) => setExamples(e))
			.catch(err => {
				console.error('error loading examples', err)
				throw err
			})
	}, [setExamples])
	return examples
}

function useOnClickProject(): OnClickHandler {
	const loadExample = useLoadProject()
	const resetProject = useResetProject()

	return useCallback(
		(example: FileDefinition) => {
			resetProject()
			loadProjectFromDefinition(example)
				.then(w => loadExample(w))
				.catch(err => {
					console.error('error loading example', err)
					throw err
				})
		},
		[loadExample, resetProject],
	)
}

async function loadProjectFromDefinition(
	definition: FileDefinition,
): Promise<ProjectJson> {
	const originUrl = window.location.origin
	const url = `${originUrl}/${definition?.url}` as string
	const result = await fetch(url)
	const wks = (await result.json()) as ProjectJson
	return {
		...wks,
		name: wks?.name ?? definition?.name,
	} as ProjectJson
}

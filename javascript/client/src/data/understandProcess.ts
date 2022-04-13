/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { WorkflowHelp } from '@showwhy/components'
import { v4 as uuidv4 } from 'uuid'

import {
	howLinks,
	whenLinks,
	whoLinks,
	whyLinks,
} from '../locales/en-US/understand-process'

export const understandProcessSteps = [
	{
		id: uuidv4(),
		title: 'Why use ShowWhy?',
		resources: whyLinks.map(link => ({ ...link, id: uuidv4() })),
		getMarkdown: async () =>
			import('../markdown/understand-process/Why.md?raw'),
	},
	{
		id: uuidv4(),

		title: 'Who is ShowWhy for?',
		resources: whoLinks.map(link => ({ ...link, id: uuidv4() })),
		getMarkdown: async () =>
			import('../markdown/understand-process/Who.md?raw'),
	},
	{
		id: uuidv4(),

		title: 'When to use ShowWhy?',
		resources: whenLinks.map(link => ({ ...link, id: uuidv4() })),
		getMarkdown: async () =>
			import('../markdown/understand-process/When.md?raw'),
	},
	{
		id: uuidv4(),

		title: 'How does ShowWhy work?',
		resources: howLinks.map(link => ({ ...link, id: uuidv4() })),
		getMarkdown: async () =>
			import('../markdown/understand-process/How.md?raw'),
	},
] as WorkflowHelp[]

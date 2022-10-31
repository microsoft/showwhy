/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export enum QuestionType {
	/**
	 * Did an event cause an outcome
	 */
	Event = 'event',

	/**
	 * Does exposure cause outcome?
	 */
	Exposure = 'exposure',

	/**
	 * Explore whether variables cause one another
	 */
	Discovery = 'discovery',
}

/**
 * Data attached to resource-tree nodes
 */
export interface ResourceTreeData {
	/**
	 * The unique node idw
	 */
	route: string

	/**
	 * The node text to use. Default=id
	 */
	title: string

	/**
	 * The icon to use in the file tree
	 */
	icon?: string

	/**
	 * Child node Data
	 */
	children?: ResourceTreeData[]
}

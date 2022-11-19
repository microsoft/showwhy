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

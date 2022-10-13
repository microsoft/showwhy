/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { AppResourceHandler, useDataPackage } from '@showwhy/app-common'
import { memo, useEffect, useMemo } from 'react'

type ProjectJson = any

export const DiscoveryPersistenceProvider: React.FC = memo(
	function ModelExposurePersistenceProvider() {
		const dp = useDataPackage()
		const getProjectJson = useGetProjectJson()
		const loadProjectJson = useLoadProjectJson()

		const persistable = useMemo(
			() =>
				new AppResourceHandler<ProjectJson>(
					'discover',
					'discover',
					getProjectJson,
					loadProjectJson,
				),
			[getProjectJson, loadProjectJson],
		)

		useEffect(() => {
			dp.addResourceHandler(persistable)
		}, [dp, persistable])

		// renderless component
		return null
	},
)

function useGetProjectJson(): () => ProjectJson {
	return () => ({})
}

function useLoadProjectJson(): (json: ProjectJson) => void {
	return (json: ProjectJson) => {
		console.log('TODO: load json', json)
	}
}

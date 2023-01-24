/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Position, SpinButton } from '@fluentui/react'
import { useDebounceFn } from 'ahooks'
import { memo, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'

import type { NotearsAlgorithmParams } from '../domain/Algorithms/Notears.js'
import { NotearsParamsState } from '../state/atoms/algorithms_params.js'
import { useOnChangeNumberInObject } from '../utils/ChangeEvents.js'
import { defaultNotearsSpinningOptions } from './NotearsParams.constants.js'
import { Container, ContainerItem } from './NotearsParams.styles.js'

export const NotearsParams: React.FC = memo(function NotearsParams() {
	const [stateNotearsParams, setStateNotearsParams] =
		useRecoilState(NotearsParamsState)
	const [notearsParams, setNotearsParams] = useState(stateNotearsParams)

	const onChangeNumberInObject = useOnChangeNumberInObject(setNotearsParams)

	const updateState = useDebounceFn(
		(value: NotearsAlgorithmParams) => {
			setStateNotearsParams(value)
		},
		{ wait: 500 },
	)

	useEffect(() => {
		updateState.run(notearsParams)
	}, [notearsParams, updateState])

	return (
		<Container>
			<ContainerItem>
				{defaultNotearsSpinningOptions.map(x => (
					<SpinButton
						label={x.label}
						key={x.inputProps?.name}
						labelPosition={Position.top}
						value={
							notearsParams?.[
								x.inputProps?.name as keyof NotearsAlgorithmParams
							]?.toString() || x.defaultValue
						}
						onChange={(_, val?: string) =>
							onChangeNumberInObject(val, x.inputProps?.name)
						}
						min={x.min}
						max={x.max}
						step={x.step}
					/>
				))}
			</ContainerItem>
		</Container>
	)
})

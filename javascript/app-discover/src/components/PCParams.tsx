/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IChoiceGroupOption } from '@fluentui/react'
import { ChoiceGroup, Position, SpinButton } from '@fluentui/react'
import { useDebounceFn } from 'ahooks'
import { memo, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'

import type { PCAlgorithmParams } from '../domain/Algorithms/PC.js'
import { PCParamsState } from '../state/atoms/algorithms_params.js'
import {
	useOnChangeNumberInObject,
	useOnChangeStringInObject,
} from '../utils/ChangeEvents.js'
import {
	ciTestChoiceOptions,
	DEFAULT_CI_TEST,
	DEFAULT_VARIANT,
	defaultPCSpinningOptions,
	variantChoiceOptions,
} from './PCParams.constants.js'
import { Container, ContainerItem } from './PCParams.styles.js'

export const PCParams: React.FC = memo(function PCParams() {
	const [statePCParams, setStatePCParams] = useRecoilState(PCParamsState)
	const [pcParams, setPCParams] = useState(statePCParams)

	const onChangeNumberInObject = useOnChangeNumberInObject(setPCParams)
	const onChangeStringInObject = useOnChangeStringInObject(setPCParams)

	const updateState = useDebounceFn(
		(value: PCAlgorithmParams) => {
			setStatePCParams(value)
		},
		{ wait: 500 },
	)

	useEffect(() => {
		updateState.run(pcParams)
	}, [pcParams, updateState])

	return (
		<Container>
			<ContainerItem>
				{defaultPCSpinningOptions.map((x) => (
					<SpinButton
						label={x.label}
						key={x.inputProps?.name}
						labelPosition={Position.top}
						value={
							pcParams?.[
								x.inputProps?.name as keyof PCAlgorithmParams
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

			<ContainerItem>
				<ChoiceGroup
					selectedKey={pcParams.variant || DEFAULT_VARIANT}
					options={variantChoiceOptions}
					onChange={(_, opt?: IChoiceGroupOption) =>
						onChangeStringInObject(opt?.key, 'variant')
					}
					label="Variant"
				/>
			</ContainerItem>

			<ContainerItem>
				<ChoiceGroup
					selectedKey={pcParams.ci_test || DEFAULT_CI_TEST}
					options={ciTestChoiceOptions}
					onChange={(_, opt?: IChoiceGroupOption) =>
						onChangeStringInObject(opt?.key, 'ci_test')
					}
					label="CI test"
				/>
			</ContainerItem>
		</Container>
	)
})

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ActionButton, FocusZone, List } from '@fluentui/react'
import { memo, Suspense, useCallback, useEffect, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import type { CausalVariable } from '../../domain/CausalVariable.js'
import {
	CausalVariablesState,
	InModelCausalVariablesState,
} from '../../state/index.js'
import { PaddedSpinner } from '../CauseDis.styles.js'
import { ListFilter } from '../controls/ListFilter.js'
import { CausalNodeListItem } from './CausalNodeListItem.js'
import { addAllButtonStyles, icons } from './CausalVariableList.styles.js'
import type { CausalVariableListProps } from './CausalVariableList.types.js'

const AddAllVariablesButton: React.FC<CausalVariableListProps> = memo(
	function AddAllVariablesButton({ variables }) {
		const setInModelVariables = useSetRecoilState(InModelCausalVariablesState)
		const handleClick = useCallback(() => {
			setInModelVariables(variables)
		}, [variables, setInModelVariables])
		return (
			<ActionButton
				onClick={handleClick}
				text={'Add all variables'}
				iconProps={icons.add}
				styles={addAllButtonStyles}
			/>
		)
	},
)

export const CausalVariableList: React.FC<CausalVariableListProps> = memo(
	function CausalVariableList({ variables }) {
		const onRenderCell = useCallback(
			(item?: CausalVariable) =>
				item && <CausalNodeListItem variable={item}></CausalNodeListItem>,
			[],
		)
		return (
			<FocusZone>
				{!!variables.length && <AddAllVariablesButton variables={variables} />}
				<List
					items={variables}
					renderedWindowsAhead={1}
					onRenderCell={onRenderCell}
					onShouldVirtualize={() => false} // force all items to be rendered
				/>
			</FocusZone>
		)
	},
)

const FilteredCausalVariablesListInternal: React.FC<CausalVariableListProps> =
	memo(function FilteredCausalVariablesListInternal({ variables }) {
		const [filteredList, setFilteredList] = useState(variables)
		const filterHandler = (
			list: Array<CausalVariable>,
			filterValue: string,
		) => {
			setFilteredList(
				list.filter(variable =>
					variable.name
						.toLocaleLowerCase()
						.includes(filterValue.toLocaleLowerCase()),
				),
			)
		}

		useEffect(() => {
			setFilteredList(variables)
		}, [variables])

		return (
			<ListFilter
				list={variables}
				filterHandler={filterHandler}
				placeholder="Search"
			>
				<CausalVariableList variables={filteredList}></CausalVariableList>
			</ListFilter>
		)
	})

const AllCausalVariablesListInternal: React.FC = memo(
	function AllCausalVariablesListInternal() {
		const allVariables = useRecoilValue(CausalVariablesState)
		const [sortedVariables, setSortedVariables] = useState<CausalVariable[]>([])
		useEffect(() => {
			const getNames = (variable: CausalVariable) => {
				if (variable?.derivedFrom !== undefined) {
					for (const sourceVarName of variable.derivedFrom) {
						const sourceVar = allVariables.find(
							v => v.columnName === sourceVarName,
						)
						if (sourceVar) {
							return [sourceVar.name, variable.name]
						}
					}
				}

				return [variable.name, '']
			}

			const sortedVars = [...allVariables].sort((cv1, cv2) => {
				const [sourceName1, variableName1] = getNames(cv1)
				const [sourceName2, variableName2] = getNames(cv2)
				if (sourceName1 === sourceName2) {
					return variableName1.localeCompare(variableName2)
				}

				return sourceName1.localeCompare(sourceName2)
			})
			setSortedVariables(sortedVars)
		}, [allVariables])

		return <FilteredCausalVariablesListInternal variables={sortedVariables} />
	},
)

export const AllCausalVariablesList = memo(function AllCausalVariablesList() {
	return (
		<Suspense fallback={<PaddedSpinner label="Loading variables..." />}>
			<AllCausalVariablesListInternal />
		</Suspense>
	)
})

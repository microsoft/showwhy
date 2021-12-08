/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { v4 as uuidv4 } from 'uuid'
import { buildNodes } from './builders'
import { getNodeProperties } from './utils'
import { NodeTypes } from '~enums'
import {
	AdditionalProperties,
	Data,
	Edge,
	FilterObject,
	Graph,
	ProjectFile,
	UploadFileResponse,
	VariableDefinition,
	NodeRequest,
	NodeResponse,
} from '~interfaces'
import { executeNode, uploadFile } from '~resources'
import { createTextFile } from '~utils/files'

const dataObject = (value: string): Data => {
	return {
		data: {
			id: value,
			value: value,
			name: value,
		},
	}
}
const edgeObject = (value: string, generalExposure: string): Edge => {
	return {
		data: {
			source: value,
			target: generalExposure,
		},
	}
}

const convertFilter = (filter: FilterObject) => {
	if (filter.filter) {
		switch (filter.filter) {
			case 'in range':
				return {
					[filter.filter]: [
						{ var: filter.column },
						filter.lower,
						filter.upper,
						filter.inclusive ? 'both' : 'neither',
					],
				}
			default:
				return { [filter.filter]: [{ var: filter.column }, filter.value] }
		}
	}
	return { no_op: [] }
}

export const filterObjects = (
	fileName: string,
	variableDefinitions: VariableDefinition[],
): { filters: any[]; references: any } => {
	const filterNodes: any[] = []
	const additionalProperties = {}

	for (const definition of variableDefinitions) {
		const refName = uuidv4()
		filterNodes.push({
			dataframe: fileName,
			result: definition.name,
			ref: refName,
		})
		additionalProperties[refName] = {
			and: definition.filters.map(filter => {
				return convertFilter(filter)
			}),
		}
	}
	return {
		filters: filterNodes,
		references: additionalProperties,
	}
}

export const prepareData = (
	confounders: string[] | null,
	outcomeDeterminants: string[] | null,
	generalExposure: string,
	generalOutcome: string,
): Promise<NodeResponse> => {
	const edges: Edge[] = []
	let nodes: Data[] = []
	let variablesNames: string[] = []

	if (confounders) {
		variablesNames = variablesNames.concat(confounders?.map(x => x))
		const confoundersData: Data[] = confounders.map((x: string) =>
			dataObject(x),
		)
		confoundersData.forEach(a => {
			edges.push(edgeObject(a.data.id, generalExposure))
			edges.push(edgeObject(a.data.id, generalOutcome))
		})
		nodes = nodes.concat(confoundersData)
	}
	if (outcomeDeterminants) {
		variablesNames = variablesNames.concat(outcomeDeterminants?.map(x => x))
		const outcomeData: Data[] = outcomeDeterminants.map((x: string) =>
			dataObject(x),
		)
		outcomeData.forEach(a => {
			edges.push(edgeObject(a.data.id, generalOutcome))
		})
		nodes = nodes.concat(outcomeData)
	}

	edges.push(edgeObject(generalExposure, generalOutcome))

	nodes = nodes.concat(dataObject(generalOutcome))
	nodes = nodes.concat(dataObject(generalExposure))

	const obj = {
		causalGraph: {
			elements: {
				nodes: nodes,
				edges: edges,
			},
		},
	}

	const nodeReq = buildNodes([
		{
			type: NodeTypes.CreateCausalGraph,
			treatment: `${generalExposure}`,
			outcome: `${generalOutcome}`,
			dataframe: 'None',
			controls: variablesNames,
			causal_graph: obj.causalGraph,
		},
		{
			type: NodeTypes.IdentifyEstimand,
			causal_model: 'primary_maximum_model',
		},
	])

	return executeNode(nodeReq)
}

export const sendFileUpload = async (
	files: ProjectFile[],
): Promise<UploadFileResponse> => {
	const formData = new FormData()
	files.forEach((f, i) => {
		const file = createTextFile(f.name, f.content)
		formData.append(`file${i}`, file)
	})
	return uploadFile(formData)
}

const buildGraph = (filePath: string, dataframeName: string) => {
	return {
		elements: {
			nodes: [
				{
					data: {
						...getNodeProperties(NodeTypes.LoadDataset),
						url: filePath,
						dataframe_name: dataframeName,
					},
				},
				{
					data: {
						...getNodeProperties(NodeTypes.EstimateEffects),
						ref: 'additional_properties',
					},
				},
			],
			edges: [
				{
					data: {
						source: 'Load Dataset',
						target: 'Estimate Effects',
					},
				},
			],
		},
	}
}

export const buildSignificanceTestsNode = (taskIds: string[]): NodeRequest => {
	const nodeReq = buildNodes([
		{
			type: NodeTypes.SignificanceTest,
			spec_ids: taskIds,
		},
	])
	return nodeReq
}

export const buildLoadNode = (url: string, fileName: string): NodeRequest => {
	const [dataframeName] = fileName.split('.')
	const nodeReq = buildNodes([
		{
			type: NodeTypes.LoadDataset,
			result: dataframeName,
			url,
		},
	])
	return nodeReq
}

export const getGraph = (
	filePath: string,
	fileName: string,
	additionalProperties: AdditionalProperties,
): Graph => {
	const [dataframeName] = fileName.split('.')
	const graph = {
		graph: buildGraph(filePath, dataframeName),
		additional_properties: additionalProperties,
	}
	return graph
}

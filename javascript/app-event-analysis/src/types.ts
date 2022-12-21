/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { MessageBarType } from '@fluentui/react/lib/MessageBar'
import type { ScaleBand, ScaleLinear } from 'd3'

//
// Charts constants
//
export const BAR_NORMAL = 1
export const BAR_TRANSPARENT = 1
export const BAR_ELEMENT_CLASS_NAME = 'bar'
export const MAX_BAR_COUNT_BEFORE_TICK_ROTATION = 5
export const MAX_BAR_COUNT_WITH_VISIBLE_LABELS = 35 // hide labels after this count
export const BAR_GAP = 0.4 // gap between bars

export const LINE_WIDTH = 1
export const LINE_WIDTH_TREATED = 2
export const OUTPUT_LINE_WIDTH = 3
export const TRANSPARENT_LINE = 0.25
export const HIGHLIGHT_LINE = 1
export const LINE_ELEMENT_CLASS_NAME = 'line-element'
export const LINE_WIDTH_HOVER = 2
export const OUTPUT_LINE = 0.5

export const BAR_CHART_HEIGHT_PERC_OF_WIN_HEIGHT = 0.35

//
// Data constants
//
export const SYNTHETIC_UNIT = 'Synthetic'
export const MAX_RENDERED_TREATED_UNITS = 10

export const CONFIGURATION_TABS = {
	prepareAnalysis: {
		label: '1. Prepare analysis',
		key: 'prepare-analysis',
	},
	estimateEffects: {
		label: '2. Estimate effects',
		key: 'estimate-effects',
	},
	validateEffects: {
		label: '3. Validate effects',
		key: 'validate-effects',
	},
}

export enum BarChartOrientation {
	column = 'column',
	row = 'row',
}

export interface ChartOptions {
	renderRawData: boolean
	showTreatmentStart: boolean
	showSynthControl: boolean
	applyIntercept: boolean
	relativeIntercept: boolean
	showGrid: boolean
	showMeanTreatmentEffect: boolean
	showChartPerUnit?: boolean
}

export interface MessageBarProps {
	content: string
	type?: MessageBarType
	isVisible: boolean
}

export interface TooltipInfo {
	data: BarData | LineData[]
	xPos: number
	yPos: number
	date?: number
	isPreviousHover?: boolean
}

export interface HoverInfo {
	hoverItem: null | TooltipInfo
	setHoverItem: (hoverItem: null | TooltipInfo) => void
}

export interface LineData {
	value: number | null
	date: number
	unit: string
	color: string
}

export interface BarData {
	name: string // e.g., the axis tick name
	value: number
	label?: string | number
	normalizedValue?: number
	color: string
	opacity?: number
}

export interface DataPoint {
	value: number
	date: number
	unit: string
	groupUnits?: string[]
	treated?: 0 | 1
	color?: string
}

export interface OutputDataPoint {
	date: number
	value: number
	color: string
	unit: string
	type: string
}

export interface Treatment {
	units: string[]
	startDates: number[]
	groups: { [name: string]: string[] }
}

export type ColumnMapping = {
	[key in keyof DataPoint | string]: string
}

export type DateFilter = {
	startDate: number
	endDate: number
}

export type ProcessedInputData = {
	dataPoints: DataPoint[]
	uniqueUnits: string[]
	uniqueDates: number[]
	startDate: number
	endDate: number
	isBalancedPanelData: boolean
	nonBalancedUnits: string[]
}

// Possible column name for each of unit, date, treated and outcome value.
export const POSSIBLE_COL_NAMES = {
	unit: ['unit', 'Unit', 'State', 'country', 'Country'],
	date: [
		'date',
		'Date',
		'Year',
		'year',
		'time',
		'Time',
		'week',
		'Week',
		'month',
		'Month',
		'day',
		'Day',
	],
	treated: ['treated', 'treat', 'Treat', 'Treated'],
	value: ['outcome', 'Outcome', 'PacksPerCapita', 'value', 'Value', 'Y'],
}

export enum Estimators {
	DID = 'Diff-in-Diff',
	SC = 'Synthetic Control',
	SDID = 'Synthetic Diff-in-Diff',
}
export type EstimatorsKeyString = keyof typeof Estimators

export enum TimeAlignmentOptions {
	Fixed_No_Overlap = 'Use first and last treated to set pre/post periods',
	Shift_And_Align_Units = 'Align treatment periods by time-shifting',
	Staggered_Design = 'Use staggered design',
}
export type TimeAlignmentKeyString = keyof typeof TimeAlignmentOptions

export type D3ScaleLinear = ScaleLinear<number, number>
export type D3ScaleBand = ScaleBand<string>
export type D3Scale = D3ScaleLinear | D3ScaleBand

export interface PlaceboData {
	unit: string
	frequency: number
}

export interface PlaceboDataGroup extends PlaceboData {
	ratio: number
}

export interface SynthControlData {
	[treatedUnit: string]: SyntheticControlUnit[]
}

export interface ResultPaneProps {
	inputData: ProcessedInputData
	outputData: (OutputData | PlaceboOutputData)[]
	synthControlData: SynthControlData
	statusMessage: MessageBarProps
	isCalculatingEstimator: boolean
	placeboDataGroup: Map<string, PlaceboDataGroup[]>
	placeboOutputData: Map<string, (OutputData | PlaceboOutputData)[]>
	timeAlignment: string
	checkableUnits: string[]
	onRemoveCheckedUnit: (unitToRemove: string) => void
}

export interface OutputData {
	output_lines_control: LineData[][]
	output_lines_treated: LineData[][]
	sdid_estimate: number
	weighted_synthdid_controls: WeightedSynthdidControls
	time_before_intervention: number
	time_after_intervention: number
	treated_pre_value: number
	treated_post_value: number
	control_pre_value: number
	control_post_value: number
	intercept_offset: number[]
	counterfactual_value: number
	treatedUnit: string
	consistent_time_window: number[] | null
	time_mapping_applied: boolean
}

export type PlaceboOutputData = {
	sdid_estimates: number[]
} & Pick<
	OutputData,
	| 'output_lines_control'
	| 'output_lines_treated'
	| 'intercept_offset'
	| 'treatedUnit'
>

// ======
// SDid output response
// ======
export interface OutputLines {
	x: number[]
	y: number[]
	color: string[]
}

export interface WeightedSynthdidControls {
	dimnames: string[]
	weights: number[]
}

export interface Output {
	lines: OutputLines
	sdid_estimate: number
	weighted_synthdid_controls: WeightedSynthdidControls
	time_before_intervention: number
	time_after_intervention: number
	treated_pre_value: number
	treated_post_value: number
	control_pre_value: number
	control_post_value: number
	intercept_offset: number
	counterfactual_value: number
}

export interface SDIDOutput {
	unit: string
	output: Output
}
export interface SDIDOutputResponse {
	message: string
	outputs: SDIDOutput[]
	compute_placebos: boolean
	consistent_time_window: number[] | null
	time_mapping_applied: boolean
}

export interface SyntheticControlUnit {
	unit: string
	weight: number
}

export interface LegendData {
	color: string
	name: string
	opacity?: number
}

export interface Dimensions {
	width: number
	height: number
	margin: { top: number; bottom: number; left: number; right: number }
}

export interface ChartDimensions {
	width: number
	height: number
	margin: { top: number; bottom: number; left: number; right: number }
}

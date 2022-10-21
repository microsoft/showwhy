/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable  @typescript-eslint/ban-ts-comment */

import { bin, extent, min, range, scaleLinear } from 'd3'
import { sortBy } from 'lodash'

import type {
	OutputDataPoint,
	PlaceboDataGroup,
	SDIDOutputResponse,
} from '../types.js'
import { getOutputPoints } from './getOutpoutPoints.js'

export function computeRMSPE(
	outputRes: SDIDOutputResponse | null,
	startDate: number,
	endDate: number,
	dates: { tStartDates: number[] } | null,
	treatedUnits: string[],
	checkedUnits: Set<string> | null,
) {
	if (!outputRes || !outputRes.compute_placebos || dates === null) return []

	const outputTreatedMap: { [key: string]: OutputDataPoint[] } = {}
	const outputControlMap: { [key: string]: OutputDataPoint[] } = {}
	const outputControlInterceptsMap: { [key: string]: number } = {}

	const { outputs } = outputRes
	outputs.forEach(outputResult => {
		const { controlPoints, treatedPoints } = getOutputPoints(outputResult)
		outputTreatedMap[outputResult.unit] = treatedPoints
		outputControlMap[outputResult.unit] = controlPoints
		outputControlInterceptsMap[outputResult.unit] =
			outputResult.output.intercept_offset
	})
	//
	// Since we have all the placebo output for all units
	//  let's calculate the "root mean squared prediction error" (RMSPE) values
	//  for the pre- and post-treatment period as the test statistic used for inference
	//
	// Reference: https://mixtape.scunning.com/synthetic-control.html#californias-proposition-99
	//
	// This will help determine whether the observed difference between the two series
	//  is a statistically significant difference
	//
	// STEPS:
	//  1. Calculate the RMSPE for each placebo for the pre-treatment period
	//   RMSPE = ((1 / (T - T0)) * SUM_T0_T(Yt - Yc) ^ 2 ) ^ 0.5
	//    T: date for treatment
	//    T0: beginning date of pre-treatment period
	//    SUM_T0_T: sum from T0 to T (each time t is changing)
	//    Yt: treated outcome at time t
	//    Yc: synthetic outcome at time t; SUM(all weighted units output)
	//
	//  2. Calculate the RMSPE for each placebo for the post-treatment period
	//     (similar equation but for the post-treatment period)
	//
	//  3. Compute the ratio of the post- to pre-treatment RMSPE
	//
	//  4. Sort this ratio in descending order from greatest to highest
	//
	//  5. Calculate the treatment unit’s ratio in the distribution as p = (Rank / Total)
	const predictionErrors: {
		unit: string
		pErrorPre: number
		pErrorPost: number
		ratio: number
	}[] = []

	const distributions: PlaceboDataGroup[] = []

	// FIXME
	// placebo is only valid for a single treated dates
	const T = dates.tStartDates[0]
	const T0 = startDate
	const T1 = endDate

	// validity check
	if (T > T1 || T < T0) {
		return []
	}

	//
	// initial pass calculating MSPE
	//
	outputs.forEach(outputResult => {
		const treatedOutputForUnit = outputTreatedMap[outputResult.unit]
		const controlOutputForUnit = outputControlMap[outputResult.unit]

		let sumPre = 0
		// @ts-ignore
		for (let t = T0; t < T; t++) {
			const tOutput = treatedOutputForUnit.find(o => o.date === t)
			const cOutput = controlOutputForUnit.find(o => o.date === t)
			const cOutputIntercepted =
				(cOutput?.value || 0) + outputControlInterceptsMap[outputResult.unit]
			sumPre += Math.pow(
				Math.abs((tOutput?.value || 0) - cOutputIntercepted),
				2,
			)
		}
		// @ts-ignore
		const pErrPre = (1 / (T - T0)) * sumPre // Math.pow((1 / (T - T0)) * sumPre, 0.5)

		let sumPost = 0
		// @ts-ignore
		for (let t = T; t <= T1; t++) {
			const tOutput = treatedOutputForUnit.find(o => o.date === t)
			const cOutput = controlOutputForUnit.find(o => o.date === t)
			const cOutputIntercepted =
				(cOutput?.value || 0) + outputControlInterceptsMap[outputResult.unit]

			sumPost += Math.pow(
				Math.abs((tOutput?.value || 0) - cOutputIntercepted),
				2,
			)
		}
		// @ts-ignore
		const pErrPost = (1 / (T1 - T)) * sumPost // Math.pow((1 / (T1 - T)) * sumPost, 0.5)

		const ratio = pErrPost / pErrPre
		predictionErrors.push({
			unit: outputResult.unit,
			pErrorPre: pErrPre,
			pErrorPost: pErrPost,
			ratio: ratio,
		})
	})

	// Filter out units whose pre-treatment RMSPE is considerably different than treated
	//  Abadie, Diamond, and Hainmueller (2010) recommends doing this by removing those
	//  ratios which are more (or less?) than two times that of treated
	const treatedPredictions = predictionErrors.find(
		prediction => prediction.unit === treatedUnits[0], // FIXME: in placebo: a single treated unit is supported
	)
	const treatedPreRatio = treatedPredictions?.pErrorPre ?? 0
	// FIXME: refactor as a user-controlled state along with manual removal of outlier placebos
	const filterExtremePlacebos = true
	const extremePlaceboRatioFactor = 2
	predictionErrors.forEach(pe => {
		const skipPlacebo =
			filterExtremePlacebos &&
			(pe.pErrorPre > treatedPreRatio * extremePlaceboRatioFactor ||
				pe.pErrorPre * extremePlaceboRatioFactor < treatedPreRatio)
		if (
			((treatedPreRatio !== 0 && !skipPlacebo) ||
				treatedPredictions === undefined) &&
			checkedUnits !== null &&
			checkedUnits.has(pe.unit)
		) {
			distributions.push({
				unit: pe.unit,
				frequency: pe.ratio /* placeholder value */,
				ratio: pe.ratio,
			})
		}
	})

	const sortedPlaceboResults = sortBy(
		distributions,
		'ratio',
	) as PlaceboDataGroup[]

	//
	// use the ratios to render a histogram
	//
	// FIXME: the following is incorrect or misleading
	const renderRatiosAsHistogram = false
	const numBins = 10
	const allValues = distributions.map(prediction => prediction.ratio)
	const minValue = min(allValues) ?? 0
	if (minValue > 0) {
		// ensure that 0 if necessary
		allValues.push(0)
	}
	const scale = scaleLinear().domain(extent(allValues) as [number, number])
	const binGenerator = bin<PlaceboDataGroup, number>()
		.domain(scale.domain() as [number, number]) // omit to use the default domain/extent from data
		// use a custom threshold generator to ensure
		//  bucket count that matches the required number of bins
		.thresholds((data, min, max) =>
			range(numBins).map(t => min + (t / numBins) * (max - min)),
		)
		.value(function (d) {
			return d.ratio
		}) // use the value stored in ratio to bin the input data
	const predictionBins = binGenerator(sortedPlaceboResults)
	const histogramBars: PlaceboDataGroup[] = []
	predictionBins.forEach(bin => {
		if (bin.length > 0) {
			const allUnits = bin.map(itemInBin => itemInBin.unit).join(' ')
			const ratioLabel =
				bin.x0 !== undefined && bin.x1 !== undefined
					? bin.x0 + (bin.x1 - bin.x0) / 2
					: 0
			histogramBars.push({
				unit: allUnits,
				frequency: bin.length, // to be mapped to bar value
				ratio: ratioLabel, // to be mapped to label on bar hover
			})
		}
	})

	return renderRatiosAsHistogram ? histogramBars : sortedPlaceboResults
}

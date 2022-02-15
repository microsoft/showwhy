/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export const confidenceIntervalCalloutLine1 = `
To generate the null distribution, we first stratify the dataset based on the propensity of exposure so that records within the same strata are expected to have similar values for control variables. We then randomly shuffle the exposure values among records within the same strata to create a bootstrapped sample under which the null hypothesis is expected to be valid. We rerun all specifications using the bootstrapped sample to create a null specification curve, and compute the median effect of the null curve. We then repeat this process for 100 simulations to generate the null distribution of median effects.
`
export const confidenceIntervalCalloutLine2 = `
We calculate p-value as the percentage of times that an equally or more extreme median effect than the original estimated effect is observed in the bootstrapped null distribution. If p-value <= 0.05, we conclude that the estimated effect is significantly different than that of the null distribution.
`

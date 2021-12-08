/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export const selectCausalEstimators = `
<p>Once you have finalized your causal model, the next step is to choose how to estimate the causal effects using statistical methods.</p>
<p>ShowWhy offers two families of estimators: exposure-assignment and outcome-based estimators. Exposure-assignment estimators group subjects into comparable groups based on their likelihood of being exposed. Average effect of exposure can then be computed as the difference in average outcomes between these comparable exposed and unexposed groups. Exposure-assignment estimators are fast, but they can only compute the average effect across the whole population, not heterogeneous effects of the exposure at subgroup or individual levels.</p>
<p>Outcome-based estimators can predict outcome for each subject based on the exposure and control variables. These are sophisticated methods that can estimate heterogeneous effects of the exposure. However, they may take a while to run.</p>
<p>Once you have a causal estimate, ShowWhy will run a set of refutation tests to assess its robustness against unverified assumptions that we made during the causal modelling process. Most of these tests involve repeatedly creating simulated datasets and rerunning the estimate to measure changes between newly estimated effects and the original estimate.</p>
<p>Use this workspace to configure alternative estimators that you want to include in your analysis plan, and the number of simulations for which you will run the refutation tests.</p>
`
export const estimateCausalEffects = `
<p>After selecting the estimation methods, we are now ready to create a set of potential analysis specifications by combining our alternative definitions of population, exposure, outcome, causal model, and estimator.</p>
<p>Select “Run now” to initiate the estimation process. As estimates become available, they will be incorporated into the visualization of the effect distribution that you can view in the next page.</p>
<p>The high-level question for this project becomes fixed when you first run your analysis, and ShowWhy maintains a log of what changed across all runs. This will help you to demonstrate the confirmatory nature of analysis – that your question, model, and data were rigorously prepared before results were computed.</p>
`
export const confidenceIntervalCalloutLine1 = `
To generate the null distribution, we first stratify the dataset based on the propensity of exposure so that records within the same strata are expected to have similar values for control variables. We then randomly shuffle the exposure values among records within the same strata to create a bootstrapped sample under which the null hypothesis is expected to be valid. We rerun all specifications using the bootstrapped sample to create a null specification curve, and compute the median effect of the null curve. We then repeat this process for 100 simulations to generate the null distribution of median effects.
`
export const confidenceIntervalCalloutLine2 = `
We calculate p-value as the percentage of times that an equally or more extreme median effect than the original estimated effect is observed in the bootstrapped null distribution. If p-value <= 0.05, we conclude that the estimated effect is significantly different than that of the null distribution.
`

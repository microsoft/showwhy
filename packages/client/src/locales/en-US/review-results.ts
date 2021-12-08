/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export const graph = `
<p>Analysis results are displayed in the form of a <i>specification curve</i>. Each dot in the top panel of the curve represents an estimated effect of the exposure on the outcome for a given specification. Positive or negative effects indicate that the exposure causes the outcome to increase or decrease respectively. Specifications that do not pass the refutation tests are marked for automatic rejection. You can select each dot to view the specification definitions behind the estimate and decide to either accept or reject the estimate.</p>
<p>If the estimates are split between positive and negative effects, then either there is no true causal effect, or some specifications are invalid. By drawing on domain knowledge, or learning more about the estimators used, you may be able to argue why some specification elements should be excluded from the analysis. This can be achieved by toggling specification elements in the bottom panel of the chart.</p>
<p>Once the estimates are completed, you can enable the “Element Contribution” view to examine the impact of each specification element on the outcome. Within this view, each dot in the bottom panel is associated with an indicator bar - the size of the bar represents the magnitude of the contribution of the given element to the estimated effect, the direction of the bar represents whether the contribution is positive or negative.</p>
<p>Once you have a final specification curve of valid estimates, move to the next page to perform the final statistical significance test for your high-level causal question.</p>
`

export const evaluateHypothesis = `
<p>ShowWhy provides a short summary of your current analysis, along with the result of a statistical significance test performed on your final set of specifications that you selected from the previous page. The test considers the null hypothesis that the exposure has no effect on the outcome. It then computes the median effect size of all estimates in the final specification curve, and determines how inconsistent this result with the null hypothesis.</p>
<p>If you have not done so, please consider running the analysis with the Full Refutation mode to obtain a more valid refutation results before making further inferences.</p>
`

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export const describeElements = `<p>We can refine the casual question in terms of three key concepts, all of which need to be defined in terms of variables either present in or derived from data: Does &lt;exposure&gt; cause &lt;outcome&gt; for &lt;population&gt;?​</p>
<p>For now, enter your initial labels and descriptions for each of the elements of your causal question in the boxes to the right. The labels will also be reflected in the header bar above, serving as a persistent reminder of the focus of the project. You can come back to edit these at any time before executing your planned analysis.​ You can also use the Datasets fields to capture the names of potential data sources for defining each element of the causal question.</p>
<p>At this stage, you should also indicate the hypothesized direction of the causal effect – do you expect the exposure to cause the outcome to change in an unknown direction, or in a specific direction (i.e., to strictly increase or decrease)?</p>`

export const definePopulation = `<p>There are likely multiple ways to define a population of subjects matching your description, for example based on different kinds of observable, measurable, or otherwise knowable attributes.​</p>
<p>Consider the variety of ways in which you might be able to operationalize your population description with one or more alternative definitions. You must specify a primary definition that best represents your population for the purpose of analysis, but you may also specify any number of secondary definitions that follow the same spirit as the high-level description.​</p>
<p>Enter labels and descriptions for your primary and secondary population definitions in the table to the right. Later in the process, you’ll work towards loading data and deriving variables that map onto these definitions.​</p>
<p>At any point, you can return to this step to view your progress towards population definition.</p>`

export const defineExposure = `<p>There are likely multiple ways to define an exposure matching your description, for example based on different kinds of observable, measurable, or otherwise knowable events.​</p>
<p>Consider the variety of ways in which you might be able to operationalize your exposure description with one or more alternative exposure definitions. You must specify a primary definition that best represents your exposure for the purpose of analysis, but you may also specify any number of secondary definitions that follow the same spirit as the high-level description.​</p>
<p>Enter labels and descriptions for your primary and secondary exposure definitions in the table to the right. Later in the process, you’ll work towards loading data and deriving variables that map onto these definitions.​</p>
<p>At any point, you can return to this step to view your progress towards exposure definition.</p>`

export const defineOutcome = `<p>There are likely multiple ways to define an outcome matching your description, for example based on different kinds of observable, measurable, or otherwise knowable events.​</p>
<p>Consider the variety of ways in which you might be able to operationalize your outcome description with one or more alternative outcome definitions. You must specify a primary definition that best represents your outcome for the purpose of analysis, but you may also specify any number of secondary definitions that follow the same spirit as the high-level description.​</p>
<p>Enter labels and descriptions for your primary and secondary outcome definitions in the table to the right. Later in the process, you’ll work towards loading data and deriving variables that map onto these definitions.​</p>
<p>At any point, you can return to this step to view your progress towards outcome definition.</p>`

export const defineCausalFactors = `<p>Recall that in the interventionist definition of causality, we say that an event X causes another event Y if we observe a difference in Y’s value after changing X, keeping everything else constant.</p>
<p>In a randomized controlled trial, we can keep everything else constant by randomly assigning subjects to the exposed and unexposed group. Such randomization ensures that there is no systematic difference between the two groups.</p>
<p>With real-world observational data, we have no similar guarantee that there is no systematic difference between the exposed and unexposed group. Indeed, there are likely to be substantial differences that affect a subject’s likelihood of exposure and their resulting outcomes. Our task is to model the factors that account such differences (e.g., the impact of age on health, wealth, etc.).</p>
<p>In the table to the right, make a note of any factors that may be relevant and important to the analysis; in other words, anything that may be causally-related to the exposure or outcome (or both). Do not be concerned at this point if you do not have ready access to data on these factors – focus instead on capturing your domain knowledge to the greatest degree possible.</p>`

export const defineFactorsCausingExposure = `<p>For each of the candidate causal factors you have identified, consider whether it is a potential cause of the exposure, and if so, how strongly you believe this to be the case.</p>
<p>Consider documenting your prior reasoning about the likely presence or absence of each possible causal relationship. Later, if desired, you can check the consistency of these assumptions against the available data and record if and how the data caused your assumptions to change.</p>`

export const defineFactorsCausedByExposure = `<p>For each of the candidate causal factors you have identified, consider whether it is potentially caused by the exposure, and if so, how strongly you believe this to be the case.</p>
<p>Consider documenting your prior reasoning about the likely presence or absence of each possible causal relationship. Later, if desired, you can check the consistency of these assumptions against the available data and record if and how the data caused your assumptions to change.</p>`

export const defineFactorsCausingOutcome = `<p>For each of the candidate causal factors you have identified, consider whether it is a potential cause of the outcome, and if so, how strongly you believe this to be the case.</p>
<p>Consider documenting your prior reasoning about the likely presence or absence of each possible causal relationship. Later, if desired, you can check the consistency of these assumptions against the available data and record if and how the data caused your assumptions to change.</p>`

export const defineFactorsCausedByOutcome = `<p>For each of the candidate causal factors you have identified, consider whether it is potentially caused by the outcome, and if so, how strongly you believe this to be the case.</p>
<p>Consider documenting your prior reasoning about the likely presence or absence of each possible causal relationship. Later, if desired, you can check the consistency of these assumptions against the available data and record if and how the data caused your assumptions to change.</p>`

export const confirmAlternativeModels = `
<p style="margin: unset">Based on your identification of possible causal factors, we can generate a range of candidate causal models with different levels of complexity:​</p>
<p>
<ul style="margin-top: unset"><li style="margin: unset">The <i>maximum</i> model including all edges with strong, moderate, or weak degree of belief​</li>
	<li style="margin: unset">The <i>intermediate</i> model including all edges with a strong or moderate degree of belief​</li>
	<li style="margin: unset">The <i>minimum</i> model including all edges with a strong degree of belief only​</li>
	<li style="margin: unset">The <i>unadjusted</i> model including only the causal edge from exposure to outcome​</li></ul></p>
<p style="margin: unset">An edge in this context is a directed graph connection (i.e., an arrow) indicating the direction of causal influence between two nodes. Any edges indicated as potentially existing in either direction are excluded from all models as being inconclusive from the perspective of domain knowledge. For our present form of causal inference aiming to emulate a randomized controlled trial, we need to control for two kinds of causal factor: confounders influencing exposure and outcome and outcome determinants influencing the outcome only.​</p>`

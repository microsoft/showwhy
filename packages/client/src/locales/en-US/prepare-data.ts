/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export const loadData = `
<p>To answer your question, you need to upload datasets containing all the necessary data to derive multiple candidate definitions of the population, exposure, outcome, and variables of interest. ​</p>
<p>ShowWhy accepts tabular data in which each row represents a record and each column represents a variable. For standard delimited text files, values in adjacent columns must be separated by a fixed delimiter, e.g., a comma (‘,’) for comma-separated value or CSV format, or a tab (‘&#92;t’) for tab-separated value or TSV format. The first line of the table needs to be a header containing the names of the variables represented in each column.</p>`

export const derivePopulation = `

<p>We now use the prepared datasets to derive the data variables that will provide concrete data for the population definitions in the causal model.</p>

<p>For each of the population definitions you have specified, consider how to process the uploaded data in ways that allow you to assign a <i>binary</i> value to each subject identifier:</p>



<ul>

<li>1 if the subject linked to the identifier meets the definition of the population;</li>

<li>0 otherwise.</li>

</ul>

<p>Determining whether a subject should be included in the population of interest may require multiple steps of data processing across multiple tables. ShowWhy simplifies this process by grouping together all columns linked to population definition across all tables. You can then derive new columns from the existing linked columns using various processing steps such as filtering and ranking.</p>

<p>When the derived column reflects the target population, select “Capture existing column as variable definition” to assign the new column to the associated definition.</p>`

export const deriveExposure = `
<p>We now use the prepared datasets to derive the data variables that will provide concrete data for the exposure definitions in the causal model.</p>
<p>For each of the exposure definitions you have specified, consider how to process the uploaded data in ways that allow you to assign a binary value to each subject identifier:</p>
<ul>
    <li>1 if the subject belongs to the “exposed” group</li>
    <li>0 if the subject belongs to the “unexposed” group.</li>
</ul>
`

export const deriveOutcome = `
<p>We now use the prepared datasets to derive the data variables that will provide concrete data for the outcome definitions in the causal model.</p>
<p>​For each of the outcome definitions you have specified, consider how to process the uploaded data in ways that allow you to assign either binary or continuous numeric values to each subject identifier representing the observed outcome.</p>
`

export const deriveControl = `
<p>We now use the prepared datasets to derive the data variables that will provide concrete data for the control factors in the causal model.</p>
<p>For each of the control factors you have specified, consider how to process the uploaded data in ways that allow you to assign either binary, categorical, or continuous values to each subject identifier representing the observed variable.</p>
<p>Given your loaded datasets, you may not be able to derive data variables for all controls in your model. Where possible, you should go back to load data describing any unobserved factors that are important to control for.</p>
<p>Since causal inference assumes that there are no unobserved confounders, the omission of any actual confounders will bias the resulting estimates. You should therefore ensure that all plausible confounding factors have been (a) considered, (b) captured in accessible datasets, and (c) operationalized as data variables.​</p>
`

export const tableColumns = `
<p>For each table, select a column to view the distribution of values within it. Remove any columns that have no possible causal relationship with either the exposure or outcome.​</p>
<p>Columns may be related to the causal question in various ways, for example by identifying the subjects of the population (e.g., via a subject ID) or by identifying attributes of these subjects that allow linking to additional relevant variables (e.g., a country identifier column that allows country-level variables to be linked to subjects via their country).​</p>
<p>Any newly identified causal factors, e.g., those related to the specifics of the data collection process rather than the domain more generally, will be integrated into the overall causal model.​</p>
​`

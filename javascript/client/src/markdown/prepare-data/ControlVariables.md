We now use the prepared datasets to derive the data variables that will provide concrete data for the control factors in the causal model.

For each of the control factors you have specified, consider how to process the uploaded data in ways that allow you to assign either binary, categorical, or continuous values to each subject identifier representing the observed variable.

Given your loaded datasets, you may not be able to derive data variables for all controls in your model. Where possible, you should go back to load data describing any unobserved factors that are important to control for.

Since causal inference assumes that there are no unobserved confounders, the omission of any actual confounders will bias the resulting estimates. You should therefore ensure that all plausible confounding factors have been (a) considered, (b) captured in accessible datasets, and (c) operationalized as data variables.​

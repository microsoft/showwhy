We now use the loaded datasets to derive the data variables that will provide concrete data for the causal factors that you have defined in your causal model. The result of this step is a single data table that serves as the input to the effect estimation stage. The final table should contain one row per subject, with data columns binding to the following variables:

1. Population columns: Each alternative population definition should be associated with a binary data column indicating whether (1) or not (0) the subject is a member of the population.
2. Exposure columns: Each alternative exposure definition should be associated with a binary data column indicating whether (1) or not (0) the subject was exposed to the exposure.
3. Outcome columns: Each alternative outcome definition should be associated with a binary or a numerical data column indicating the outcome of the exposure experienced by the subject.
4. Control columns: Each confounder or outcome determinant should be associated with a binary or a numerical data column.

You can apply various processing steps on your loaded datasets before binding the derived data columns to the pre-defined causal factors and reviewing the final output table.

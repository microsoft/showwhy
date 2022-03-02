We now use the prepared datasets to derive the data variables that will provide concrete data for the population definitions in the causal model.

For each of the population definitions you have specified, consider how to process the uploaded data in ways that allow you to assign a _binary_ value to each subject identifier:

- 1 if the subject linked to the identifier meets the definition of the population;
- 0 otherwise.

Determining whether a subject should be included in the population of interest may require multiple steps of data processing across multiple tables. ShowWhy simplifies this process by grouping together all columns linked to population definition across all tables. You can then derive new columns from the existing linked columns using various processing steps such as filtering and ranking.

When the derived column reflects the target population, select “Capture existing column as variable definition” to assign the new column to the associated definition.

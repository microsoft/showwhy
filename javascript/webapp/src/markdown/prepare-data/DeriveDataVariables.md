Use the loaded datasets to derive data variables for your domain model. The result of this stage must be a single data table containing one row per subject and one column per data variable. Column data types must also match their assigned variables:

1. Population and Exposure variables must be _binary_ columns indicating whether (1) or not (0) the subject is a member of the population / was exposed to the exposure.
2. Outcome variables must be either _binary_ or _numerical_ columns indicating the outcome experienced by the subject.
3. Control variables can be either _binary_, _numerical_, or _categorial_ columns indicating the attributes associated with the subject.

Null values for any variable type will result in the corresponding subject being removed from the population for any analyses based on that variable definition.

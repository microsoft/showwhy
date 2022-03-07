Once you have finalized your causal model, the next step is to choose how to estimate the causal effects using statistical methods.

ShowWhy offers two families of estimators: exposure-assignment and outcome-based estimators. Exposure-assignment estimators group subjects into comparable groups based on their likelihood of being exposed. Average effect of exposure can then be computed as the difference in average outcomes between these comparable exposed and unexposed groups. Exposure-assignment estimators are fast, but they can only compute the average effect across the whole population, not heterogeneous effects of the exposure at subgroup or individual levels.

Outcome-based estimators can predict outcome for each subject based on the exposure and control variables. These are sophisticated methods that can estimate heterogeneous effects of the exposure. However, they may take a while to run.

Once you have a causal estimate, ShowWhy will run a set of refutation tests to assess its robustness against unverified assumptions that we made during the causal modelling process. Most of these tests involve repeatedly creating simulated datasets and rerunning the estimate to measure changes between newly estimated effects and the original estimate.

Use this workspace to configure alternative estimators that you want to include in your analysis plan, and the number of simulations for which you will run the refutation tests.

ShowWhy creates many alternative specifications of the desired causal analysis using all combinations of variable definitions, causal models, and selected estimators. Select “Run now” to initiate server-side estimation.

Analysis results are displayed in the form of a [_specification curve_](https://www.nature.com/articles/s41562-020-0912-z). Each dot in the top panel represents the estimated effect of the exposure on the outcome for a given specification, represented below as the combination of a population definition, an exposure definition, a causal model, and a statistical estimator.

Positive or negative effects indicate that the exposure causes the outcome to increase or decrease respectively. You can select each dot to view the specification definitions behind the estimate and decide to either accept or reject the estimate. Specifications that do not pass the refutation tests are rejected automatically.

If estimates are split between positive and negative effects, then either there is no true causal effect, or some specifications are invalid. By drawing on domain knowledge, or learning more about the estimators used, you may be able to argue why some specification elements should be excluded from the analysis. This can be achieved by toggling specification elements in the bottom panel.

Once the estimates are completed, you can enable “Element Contribution” to examine the impact of each specification element on the outcome. Within this view, each dot in the bottom panel is associated with an indicator bar representing the size and direction of element’s contribution of to the estimated effect.

Based on your identification of possible causal factors, we can generate a range of candidate causal models with different levels of complexity:​

- The _maximum_ model including all edges with strong, moderate, or weak degree of belief​
- The _intermediate_ model including all edges with a strong or moderate degree of belief​
- The _minimum_ model including all edges with a strong degree of belief only​
- The _unadjusted_ model including only the causal edge from exposure to outcome​

An edge in this context is a directed graph connection (i.e., an arrow) indicating the direction of causal influence between two nodes. Any edges indicated as potentially existing in either direction are excluded from all models as being inconclusive from the perspective of domain knowledge. For our present form of causal inference aiming to emulate a randomized controlled trial, we need to control for two kinds of causal factor: confounders influencing exposure and outcome and outcome determinants influencing the outcome only.​

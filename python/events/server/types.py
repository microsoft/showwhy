from pydantic import BaseModel


class Data(BaseModel):
    input_data: list
    estimator: str  # "sdid" OR "sc" OR "did"
    time_alignment: str  # "fixed_no_overlap" OR "shift_and_align_units" OR "staggered_design"
    compute_placebos: bool
    treatment_start_dates: list  # of int
    treated_units: list  # of str
    lib: str


class OutputLines:
    x: list
    y: list
    color: list

    def __init__(self, x, y, color):
        self.x = x
        self.y = y
        self.color = color


class WeightedSynthdidControls:
    dimnames: list
    weights: list

    def __init__(self, unit_names, weights):
        self.dimnames = unit_names
        self.weights = weights


class OutputResult:
    lines: OutputLines
    sdid_estimate: float
    weighted_synthdid_controls: WeightedSynthdidControls
    time_before_intervention: float
    time_after_intervention: float
    treated_pre_value: float
    treated_post_value: float
    control_pre_value: float
    control_post_value: float
    intercept_offset: float
    counterfactual_value: float

    def __init__(
        self,
        lines,
        sdid_estimate,
        weighted_synthdid_controls,
        time_before_intervention,
        time_after_intervention,
        treated_pre_value,
        treated_post_value,
        control_pre_value,
        control_post_value,
        intercept_offset,
        counterfactual_value,
    ):
        self.lines = lines
        self.sdid_estimate = sdid_estimate
        self.weighted_synthdid_controls = weighted_synthdid_controls
        self.time_before_intervention = time_before_intervention
        self.time_after_intervention = time_after_intervention
        self.treated_pre_value = treated_pre_value
        self.treated_post_value = treated_post_value
        self.control_pre_value = control_pre_value
        self.control_post_value = control_post_value
        self.intercept_offset = intercept_offset
        self.counterfactual_value = counterfactual_value

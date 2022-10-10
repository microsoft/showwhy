import numpy as np
import onnxruntime

numCols = 7
ors = onnxruntime.InferenceSession("server/deci.onnx")
# input = {
# 	'X': np.random.randn(1, numCols).astype('float32'),
# 	'W_adj': np.random.randn(numCols, numCols).astype('float32'),
# 	'intervention_mask': np.ones(numCols, dtype=bool),
# 	'intervention_values': np.random.randn(numCols).astype('float32')}
# input = {
# 	'X': np.random.randn(1, numCols).astype('float32'),
# 	'W_adj': np.random.randn(numCols, numCols).astype('float32'),
# 	'intervention_mask': np.zeros(numCols, dtype=bool),
# 	'intervention_values': np.random.randn(0).astype('float32')}
input = {
    "X": np.random.randn(1, numCols).astype("float32"),
    "W_adj": np.random.randn(numCols, numCols).astype("float32"),
    "intervention_mask": np.array([0, 1, 1, 0, 0, 0, 0], dtype="bool"),
    "intervention_values": np.random.randn(2).astype("float32"),
}

out = ors.run(None, input)
print(input)
print(out)

---
title: "Sampling with prior knowledge for high-dimensional gravitational wave data analysis"
excerpt: ""
collection: portfolio




---

Extracting knowledge from high-dimensional data has been notoriously difficult, primarily due to the so-called "curse of dimensionality" and the complex joint distributions of these dimensions. This is a particularly profound issue for high-dimensional gravitational wave data analysis where one requires to conduct Bayesian inference and estimate joint posterior distributions. In this study, we incorporate prior physical knowledge by sampling from desired interim distributions to develop the training dataset. Accordingly, the more relevant regions of the high-dimensional feature space are covered by additional data points, such that the model can learn the subtle but important details. We adapt the normalizing flow method to be more expressive and trainable, such that the information can be effectively extracted and represented by the transformation between the prior and target distributions. Once trained, our model only takes approximately 1 s on one V100 GPU to generate thousands of samples for probabilistic inference purposes. The evaluation of our approach confirms the efficacy and efficiency of gravitational wave data inferences and points to a promising direction for similar research. The source code, specifications, and detailed procedures are publicly accessible on GitHub.

[Download paper here](https://ieeexplore.ieee.org/abstract/document/9663260)

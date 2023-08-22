---
title: "AIPerf: Automated machine learning as an AI-HPC benchmark"
excerpt: ""
collection: portfolio



---

The plethora of complex Artificial Intelligence (AI) algorithms and available High-Performance Computing (HPC) power stimulates the expeditious development of AI components with heterogeneous designs. Consequently, the need for cross-stack performance benchmarking of AI-HPC systems has rapidly emerged. In particular, the defacto HPC benchmark, LINPACK, cannot reflect the AI computing power and input/output performance without a representative workload. Current popular AI benchmarks, such as MLPerf, have a fixed problem size and therefore limited scalability. To address these issues, we propose an end-to-end benchmark suite utilizing automated machinelearning, which not only represents real AI scenarios, but also is auto-adaptively scalable to various scales ofmachines. We implement the algorithms in a highly parallel and flexible way to ensure the efficiency and optimizationpotential on diverse systems with customizable configurations. We utilize Operations Per Second (OPS), which ismeasured in an analytical and systematic approach, as a major metric to quantify the AI performance. We performevaluations on various systems to ensure the benchmark's stability and scalability, from 4 nodes with 32 NVIDIA Tesla T4 (56.1 Tera-OPS measured) up to 512 nodes with 4096 Huawei Ascend 910 (194.53 Peta-OPS measured), and the results show near-linear weak scalability. With a flexible workload and single metric, AIPerf can easily scaleon and rank AI-HPC, providing a powerful benchmark suite for the coming supercomputing era.

[Download paper here](https://ieeexplore.ieee.org/abstract/document/9430136)

---
# Generated publication snapshot. Edit src/content/publication-sources.yaml and
# run `npm run sync:papers`; do not hand-edit this file.
papers:
  - date: 2026-11-10
    title:
      en: "Beyond the Log-Linear Frontier: Pre-Asymptotic Analysis of Finite-Budget Neural Scaling Laws"
      zh: "Beyond the Log-Linear Frontier: Pre-Asymptotic Analysis of Finite-Budget Neural Scaling Laws"
    authors:
      - { name: "Tianyu Zhao" }
      - { name: "Zhixiang Ren", principal: true }
    venue: "arXiv"
    status: { en: "Preprint", zh: "预印本" }
    source: arxiv
    abstract: "Classical neural scaling laws model excess risk as a separable power law in model capacity $N$ and dataset size $D$. At finite budgets, however, empirical learning curves and compute-optimal allocations depart from this log-linear frontier. This paper analyzes how spectral and domain heterogeneity govern these finite-scale departures. Along the capacity axis, Mellin--Barnes analysis of covariance resolvents yields a three-term expansion where competing spectral and regularization modes produce finite-scale curvature and logarithmic transitions. Because fitting multiple power laws on narrow pilot grids is ill-conditioned, we eliminate the loss floor via first-order Aitken differencing to obtain a well-conditioned closed-form initializer. Along the data axis, KKT duality reduces $K$-domain mixing to scalar water-filling, yielding finite-budget bottleneck bounds, an online sampling curriculum, and a simplex Hessian metric for cross-domain transfer. Along the iso-compute frontier $C=6ND$, we prove that the optimal allocation exponent drifts in proportion to capacity and data exponent variances, while Schur-complement reduction separates intrinsic drift from frozen-hyperparameter bias. Across 45 operator spectra, Pythia (70M--12B), Chinchilla (245 runs), and RegMix (17 domains), our estimators achieve $5.89\\%$ holdout MAPE, cut high-compute allocation regret by up to $76.4\\%$, and reduce cross-scale mixture RMSE by $59.4\\%$ with zero selection regret."
    bibtex: |-
      @misc{Zhao2026Beyond,
        title = {Beyond the Log-Linear Frontier: Pre-Asymptotic Analysis of Finite-Budget Neural Scaling Laws},
        author = {Tianyu Zhao and Zhixiang Ren},
        year = {2026},
        eprint = {2611.13534},
        archivePrefix = {arXiv},
        primaryClass = {cs.LG}
      }
    links:
      arxiv: "https://arxiv.org/abs/2611.13534"
    featured: true

  - date: 2026-10-20
    title:
      en: "Foundations of the Scaling Law"
      zh: "Foundations of the Scaling Law"
    authors:
      - { name: "Tianyu Zhao" }
      - { name: "Zhixiang Ren", principal: true }
    venue: "arXiv"
    status: { en: "Preprint", zh: "预印本" }
    source: arxiv
    abstract: "Empirical scaling laws relate loss to parameters $N$, training tokens $D$ and compute $C$. This technical note explains three mechanisms behind their exponents. Local approximation bounds function error at rate $N_e^{-γs/d}$, with effective parameters $N_e$, smoothness $s$, reuse exponent $γ$ and dimension $d$; the loss function determines the risk bound. Independent feature coverage gives $α_D=(β-1)/ζ$ from predictive-weight decay $β$ and occurrence rarity $ζ$. Separable-loss optimization determines training allocations and deployment crossovers. Nonlinear scoring can produce apparent emergent abilities, while grokking concerns delayed generalization and verification constrains test-time scaling. For regular molecular configurations, the $\\mathrm{SE}(3)$ quotient gives $d_{\\mathrm{int}}=d-6$ and relative approximation-exponent gain $6/d_{\\mathrm{int}}$. Optimized dense-to-equivariant excess-loss ratios scale as $C^{p_{\\mathrm{eq}}-p_{\\mathrm{dense}}}$, where $p_j$ are compute-loss exponents and the prefactor depends on loss amplitudes and FLOP costs. Domain examples also cover visual resolution, conformational coverage and correlated-sample precision."
    bibtex: |-
      @misc{Zhao2026Foundations,
        title = {Foundations of the Scaling Law},
        author = {Tianyu Zhao and Zhixiang Ren},
        year = {2026},
        eprint = {2610.27789},
        archivePrefix = {arXiv},
        primaryClass = {cs.LG}
      }
    links:
      arxiv: "https://arxiv.org/abs/2610.27789"
    featured: true

  - date: 2026-09-07
    title:
      en: "Artificial intelligence-enabled induced-proximity drug discovery: Designing productive molecular associations"
      zh: "Artificial intelligence-enabled induced-proximity drug discovery: Designing productive molecular associations"
    authors:
      - { name: "Haomin Wu" }
      - { name: "Yaxin Xu" }
      - { name: "Zhiwei Nie" }
      - { name: "Zhongyang Zhou" }
      - { name: "Zhengyu Ma" }
      - { name: "Zhixiang Ren", principal: true }
    venue: "Drug Discovery Today"
    venueShort: "Drug Discov. Today"
    status: { en: "Published", zh: "已发表" }
    source: crossref
    abstractFallback:
      summary: "This review surveys how AI can help design drugs that bring biomolecules together to change their function. It covers target and partner selection, prediction of complex structures, and candidate design across degradative and nondegradative approaches. The authors emphasize benchmarks grounded in mechanism, analysis of failed predictions, and early evaluation of whether candidates are practical to develop."
      url: "https://pubmed.ncbi.nlm.nih.gov/42705572/"
    bibtex: |-
      @article{Wu_2026,
        title={Artificial intelligence-enabled induced-proximity drug discovery: Designing productive molecular associations},
        volume={31},
        ISSN={1359-6446},
        url={http://dx.doi.org/10.1016/j.drudis.2026.104796},
        DOI={10.1016/j.drudis.2026.104796},
        number={6},
        journal={Drug Discovery Today},
        publisher={Elsevier BV},
        author={Wu, Haomin and Xu, Yaxin and Nie, Zhiwei and Zhou, Zhongyang and Ma, Zhengyu and Ren, Zhixiang},
        year={2026},
        month=Dec,
        pages={104796}
      }
    links:
      doi: "https://doi.org/10.1016/j.drudis.2026.104796"
    featured: true

  - date: 2026-07-24
    title:
      en: "Phenotype-driven de novo molecular design from gene expression signatures"
      zh: "Phenotype-driven de novo molecular design from gene expression signatures"
    authors:
      - { name: "Yaxin Xu" }
      - { name: "Taojie Kuang" }
      - { name: "Shuang Ge" }
      - { name: "Haomin Wu" }
      - { name: "Mingqing Wang" }
      - { name: "Huan Xu" }
      - { name: "Fengwei An" }
      - { name: "Zhengyu Ma" }
      - { name: "Qiang Cheng" }
      - { name: "Zhixiang Ren", principal: true }
    venue: "bioRxiv"
    status: { en: "Preprint", zh: "预印本" }
    source: crossref
    abstract: "A bstract Target-based and structure-guided drug design remain central to modern drug discovery, but complementary strategies are needed when predefined targets or binding pockets do not fully capture disease biology. Gene-expression signatures provide scalable system-level readouts of disease and perturbation states, making them attractive inputs for phenotype-guided molecular design. However, preserving phenotypic information during molecular generation remains challenging, and chemically plausible molecules may lose connection to the intended biological response. Here, we present Tx2Mol, a transcriptome-guided framework that translates gene-expression signatures into candidate molecules while maintaining biological guidance throughout generation. We evaluated Tx2Mol across three biological settings: bulk gene perturbation, single-cell perturbation, and patient-derived disease signatures; and three validation dimensions: chemical plausibility, structural compatibility, and phenotypic preservation. Across 10 cancer-relevant bulk gene-perturbation benchmarks, Tx2Mol outperformed 9 transcriptome-guided baselines, improving maximum Tanimoto similarity to known ligands by 24.10% on average and by 50.67% on HDAC1. Structure-based analyses further supported structurally novel candidates with favorable predicted target binding. Tx2Mol also generalized to noisy single-cell perturbation profiles and preserved drug-induced transcriptional responses through in silico drug-perturbation validation. Patient-derived disease signatures further guided molecular generation toward approved-drug chemical space. Together, these results support gene-expression phenotypes as actionable guidance signals for phenotype-directed molecular design and candidate prioritization."
    bibtex: |-
      @article{Xu_2026, title={Phenotype-driven de novo molecular design from gene expression signatures}, url={http://dx.doi.org/10.64898/2026.07.21.739736}, DOI={10.64898/2026.07.21.739736}, publisher={openRxiv}, author={Xu, Yaxin and Kuang, Taojie and Ge, Shuang and Wu, Haomin and Wang, Mingqing and Xu, Huan and An, Fengwei and Ma, Zhengyu and Cheng, Qiang and Ren, Zhixiang}, year={2026}, month=July }
    links:
      doi: "https://doi.org/10.64898/2026.07.21.739736"
      code: "https://github.com/Yaxin-Xu/Tx2Mol"
    featured: true

  - date: 2026-08-03
    title:
      en: "The limits of bio-molecular modeling with large language models: a cross-scale evaluation"
      zh: "The limits of bio-molecular modeling with large language models: a cross-scale evaluation"
    authors:
      - { name: "Yaxin Xu" }
      - { name: "Yue Zhou" }
      - { name: "Tianyu Zhao" }
      - { name: "Zhengyu Ma" }
      - { name: "Fengwei An" }
      - { name: "Zhixiang Ren", principal: true }
    venue: "Bioinformatics"
    venueShort: "Bioinformatics"
    status: { en: "Published", zh: "已发表" }
    source: crossref
    abstract: "Abstract Motivation The modeling of bio-molecular system across molecular scales remains a central challenge in scientific research. Large language models (LLMs) are increasingly applied to bio-molecular discovery, yet systematic evaluation across multi-scale biological problems and rigorous assessment of their tool-augmented capabilities remain limited. Results We reveal a systematic gap between LLM performance and mechanistic understanding through the proposed cross-scale bio-molecular benchmark: BioMol-LLM-Bench, a unified framework comprising 26 downstream tasks that covers 4 distinct difficulty levels, and computational tools are integrated for a more comprehensive evaluation. Evaluation on 13 representative models reveals 4 benchmark-specific observations: chain-of-thought-style training does not consistently improve performance on the evaluated biological tasks; the evaluated hybrid mamba–attention model shows strong performance on long bio-molecular sequence tasks; supervised fine-tuned models show task-specific specialization with reduced performance in some general settings; and current LLMs perform better on classification tasks than on challenging regression tasks under this benchmark setting. Availability Source code is available at https://github.com/AI-HPC-Research-Team/BioMol-LLM-Bench"
    bibtex: |-
      @article{Xu_2026, title={The limits of bio-molecular modeling with large language models: a cross-scale evaluation}, volume={42}, ISSN={1367-4811}, url={http://dx.doi.org/10.1093/bioinformatics/btag550}, DOI={10.1093/bioinformatics/btag550}, number={8}, journal={Bioinformatics}, publisher={Oxford University Press (OUP)}, author={Xu, Yaxin and Zhou, Yue and Zhao, Tianyu and Ma, Zhengyu and An, Fengwei and Ren, Zhixiang}, editor={Uhlmann, Virginie}, year={2026}, month=July }
    links:
      doi: "https://doi.org/10.1093/bioinformatics/btag550"
      code: "https://github.com/LingQiong-AI-Lab/BioMol-LLM-Bench"
    featured: true

  - date: 2026-05-11
    title:
      en: "Pseudodata-Guided Invariant Representation Learning Boosts the Out-of-Distribution Generalization in Enzymatic Kinetic Parameter Prediction"
      zh: "Pseudodata-Guided Invariant Representation Learning Boosts the Out-of-Distribution Generalization in Enzymatic Kinetic Parameter Prediction"
    authors:
      - { name: "Haomin Wu" }
      - { name: "Zhiwei Nie" }
      - { name: "Hongyu Zhang" }
      - { name: "Zhixiang Ren", principal: true }
    venue: "Journal of Chemical Information and Modeling"
    venueShort: "J. Chem. Inf. Model."
    status: { en: "Published", zh: "已发表" }
    source: crossref
    abstractFallback:
      summary: "The authors present a module that helps enzyme kinetics predictors generalize to enzymes with sequences unlike those in their training data. It trains models to learn consistent representations from original and perturbed enzyme–substrate pairs. Across benchmarks defined by sequence similarity, adding the module improved estimates of turnover rates and Michaelis constants."
      url: "https://pubmed.ncbi.nlm.nih.gov/42037561/"
    bibtex: |-
      @article{Wu_2026, title={Pseudodata-Guided Invariant Representation Learning Boosts the Out-of-Distribution Generalization in Enzymatic Kinetic Parameter Prediction}, volume={66}, ISSN={1549-960X}, url={http://dx.doi.org/10.1021/acs.jcim.5c03204}, DOI={10.1021/acs.jcim.5c03204}, number={9}, journal={Journal of Chemical Information and Modeling}, publisher={American Chemical Society (ACS)}, author={Wu, Haomin and Nie, Zhiwei and Zhang, Hongyu and Ren, Zhixiang}, year={2026}, month=Apr, pages={5068–5077} }
    links:
      doi: "https://doi.org/10.1021/acs.jcim.5c03204"
    featured: true

  - date: 2026-05-15
    title:
      en: "Improving Variant Effect Prediction by Steering Sparse Mechanistic Features in Protein Language Models"
      zh: "Improving Variant Effect Prediction by Steering Sparse Mechanistic Features in Protein Language Models"
    authors:
      - { name: "Mingqing Wang" }
      - { name: "Meng Yuan" }
      - { name: "Athanasios V. Vasilakos" }
      - { name: "Yonghong He" }
      - { name: "Zhixiang Ren", principal: true }
    venue: "bioRxiv"
    status: { en: "Preprint", zh: "预印本" }
    source: crossref
    abstract: "Abstract Protein language models (PLMs) like the ESM series encapsulate immense evolutionary knowledge within their high-dimensional continuous embeddings. However, these latent representations are densely entangled, obscuring the fine-grained biophysical constraints necessary for precise functional resolution. To unlock the full expressive power of these embeddings, we propose PLM-SAE, a mechanistic framework that employs Sparse Autoencoders (SAEs) to disentangle PLM representations into discrete, biologically interpretable activations. By isolating and directly intervening on critical functional features, we fundamentally enhance the structural and mutational awareness of the underlying embeddings. We rigorously validate this embedding enhancement on variant effect prediction (VEP). In the unsupervised zero-shot setting, our sparse modulation elevates the state-of-the-art ESM-3 model, yielding performance improvements across 114 deep mutational scanning datasets and delivering an 80.8% relative improvement on challenging targets like the human E3 ubiquitin ligase HECD1. Furthermore, our target-specific differentiable gating mechanism achieves consistent performance gains in over 80% of evaluated datasets with an average Spearman ρ increase of +0.138. Finally, extending this approach to a cross-fitness multitask architecture establishes new state-of-the-art results on 17 VenusMutHub datasets, highlighted by a 169.0% performance surge in small-molecule binding predictions. Our work demonstrates that refining the highly entangled latent manifold via sparse modulation provides a robust and generalizable foundation for enhancing downstream PLM capabilities."
    bibtex: |-
      @article{Wang_2026, title={Improving Variant Effect Prediction by Steering Sparse Mechanistic Features in Protein Language Models}, url={http://dx.doi.org/10.64898/2026.05.12.724472}, DOI={10.64898/2026.05.12.724472}, publisher={openRxiv}, author={Wang, Mingqing and Yuan, Meng and Vasilakos, Athanasios V. and He, Yonghong and Ren, Zhixiang}, year={2026}, month=May }
    links:
      doi: "https://doi.org/10.64898/2026.05.12.724472"
    featured: true

  - date: 2026-03-08
    title:
      en: "Prototype-based continual cell-type annotation reveals cellular state transitions in expanding single-cell atlases"
      zh: "Prototype-based continual cell-type annotation reveals cellular state transitions in expanding single-cell atlases"
    authors:
      - { name: "Shuang Ge" }
      - { name: "Qiming He" }
      - { name: "Yiming Ren" }
      - { name: "Yaxin Xu" }
      - { name: "Mingqing Wang" }
      - { name: "Zhiwei Nie" }
      - { name: "Huan Xu" }
      - { name: "Qiang Cheng" }
      - { name: "Shuqing Sun" }
      - { name: "Zhixiang Ren", principal: true }
    venue: "bioRxiv"
    status: { en: "Preprint", zh: "预印本" }
    source: crossref
    abstract: "ABSTRACT Large-scale single-cell atlases provide an increasingly comprehensive view of cellular diversity, but their continued expansion across studies poses a fundamental challenge: preserving consistent cell identities while capturing biological variation in cellular states. Most existing annotation frameworks are built around static references, making it difficult to incorporate newly generated datasets into established cellular representations without retraining on historical data. When updated sequentially, these methods are further constrained by catastrophic forgetting and batch-specific biases, limiting scalability and the continuity of knowledge integration. Here we introduce scEvolver, a continual learning framework for single-cell annotation that incrementally accumulates knowledge through memory-guided refinement of cell-type prototypes without revisiting historical data. Across sequencing platforms, tissue contexts and molecular modalities, scEvolver supports robust annotation and external query mapping with substantially fewer labelled reference cells. By preserving consistent cell-type semantics across datasets while capturing biologically meaningful within-class heterogeneity, scEvolver enables the identification of epithelial cell-state transitions in inflammatory gut disease. External mapping to the healthy Human Lung Cell Atlas further reveals shared cell-state deviations across multiple diseases, including an FCGR3A + inflammatory monocyte programme in sarcoidosis, chronic obstructive pulmonary disease and idiopathic pulmonary fibrosis, highlighting scEvolver’s potential to characterize context-specific cellular dynamics in complex disease settings."
    bibtex: |-
      @article{Ge_2026, title={Prototype-based continual cell-type annotation reveals cellular state transitions in expanding single-cell atlases}, url={http://dx.doi.org/10.64898/2026.03.05.709973}, DOI={10.64898/2026.03.05.709973}, publisher={openRxiv}, author={Ge, Shuang and He, Qiming and Ren, Yiming and Xu, Yaxin and Wang, Mingqing and Nie, Zhiwei and Xu, Huan and Cheng, Qiang and Sun, Shuqing and Ren, Zhixiang}, year={2026}, month=Mar }
    links:
      doi: "https://doi.org/10.64898/2026.03.05.709973"
      code: "https://github.com/LingQiong-AI-Lab/scEvolver"
    featured: false

  - date: 2025-09-01
    title:
      en: "A self-feedback knowledge elicitation approach for chemical reaction predictions"
      zh: "A self-feedback knowledge elicitation approach for chemical reaction predictions"
    authors:
      - { name: "Pengfei Liu" }
      - { name: "Jun Tao" }
      - { name: "Zhixiang Ren", principal: true }
    venue: "Engineering Applications of Artificial Intelligence"
    venueShort: "Eng. Appl. Artif. Intell."
    status: { en: "Published", zh: "已发表" }
    source: crossref
    bibtex: |-
      @article{Liu_2025, title={A self-feedback knowledge elicitation approach for chemical reaction predictions}, volume={156}, ISSN={0952-1976}, url={http://dx.doi.org/10.1016/j.engappai.2025.111112}, DOI={10.1016/j.engappai.2025.111112}, journal={Engineering Applications of Artificial Intelligence}, publisher={Elsevier BV}, author={Liu, Pengfei and Tao, Jun and Ren, Zhixiang}, year={2025}, month=Sept, pages={111112} }
    links:
      doi: "https://doi.org/10.1016/j.engappai.2025.111112"
      code: "https://github.com/LingQiong-AI-Lab/SLM4CRP"
    featured: false

  - date: 2025-09-01
    title:
      en: "Deep learning methods for protein representation and function prediction: A comprehensive overview"
      zh: "Deep learning methods for protein representation and function prediction: A comprehensive overview"
    authors:
      - { name: "Mingqing Wang" }
      - { name: "Zhiwei Nie" }
      - { name: "Yonghong He" }
      - { name: "Athanasios V. Vasilakos" }
      - { name: "Qiang (Shawn) Cheng" }
      - { name: "Zhixiang Ren", principal: true }
    venue: "Engineering Applications of Artificial Intelligence"
    venueShort: "Eng. Appl. Artif. Intell."
    status: { en: "Published", zh: "已发表" }
    source: crossref
    bibtex: |-
      @article{Wang_2025, title={Deep learning methods for protein representation and function prediction: A comprehensive overview}, volume={155}, ISSN={0952-1976}, url={http://dx.doi.org/10.1016/j.engappai.2025.110977}, DOI={10.1016/j.engappai.2025.110977}, journal={Engineering Applications of Artificial Intelligence}, publisher={Elsevier BV}, author={Wang, Mingqing and Nie, Zhiwei and He, Yonghong and Vasilakos, Athanasios V. and Cheng, Qiang (Shawn) and Ren, Zhixiang}, year={2025}, month=Sept, pages={110977} }
    links:
      doi: "https://doi.org/10.1016/j.engappai.2025.110977"
    featured: false

  - date: 2025-08-11
    title:
      en: "A Unified Peptide Generative Framework via a Weakly Order-Dependent Autoregressive Language Model and Lifelong Learning"
      zh: "A Unified Peptide Generative Framework via a Weakly Order-Dependent Autoregressive Language Model and Lifelong Learning"
    authors:
      - { name: "Zhiwei Nie" }
      - { name: "Daixi Li" }
      - { name: "Yutian Liu" }
      - { name: "Fan Xu" }
      - { name: "Hongyu Zhang" }
      - { name: "Xiansong Huang" }
      - { name: "Xudong Liu" }
      - { name: "Zhennan Wang" }
      - { name: "Yiming Ma" }
      - { name: "Yuxin Ye" }
      - { name: "Feng Yin" }
      - { name: "Wen-Bin Zhang" }
      - { name: "Zhixiang Ren", principal: true }
      - { name: "Zhihong Liu" }
      - { name: "Zigang Li" }
      - { name: "Jie Chen" }
    venue: "Journal of Chemical Information and Modeling"
    venueShort: "J. Chem. Inf. Model."
    status: { en: "Published", zh: "已发表" }
    source: crossref
    bibtex: |-
      @article{Nie_2025, title={A Unified Peptide Generative Framework via a Weakly Order-Dependent Autoregressive Language Model and Lifelong Learning}, volume={65}, ISSN={1549-960X}, url={http://dx.doi.org/10.1021/acs.jcim.5c00623}, DOI={10.1021/acs.jcim.5c00623}, number={15}, journal={Journal of Chemical Information and Modeling}, publisher={American Chemical Society (ACS)}, author={Nie, Zhiwei and Li, Daixi and Liu, Yutian and Xu, Fan and Zhang, Hongyu and Huang, Xiansong and Liu, Xudong and Wang, Zhennan and Ma, Yiming and Ye, Yuxin and Yin, Feng and Zhang, Wen-Bin and Ren, Zhixiang and Liu, Zhihong and Li, Zigang and Chen, Jie}, year={2025}, month=Aug, pages={7919–7935} }
    links:
      doi: "https://doi.org/10.1021/acs.jcim.5c00623"
    featured: false

  - date: 2025-08-01
    title:
      en: "A multi-modal genomic knowledge distillation framework for drug response prediction"
      zh: "A multi-modal genomic knowledge distillation framework for drug response prediction"
    authors:
      - { name: "Shuang Ge" }
      - { name: "Shuqing Sun" }
      - { name: "Huan Xu" }
      - { name: "Qiang Cheng" }
      - { name: "Zhixiang Ren", principal: true }
    venue: "Applied Intelligence"
    venueShort: "Appl. Intell."
    status: { en: "Published", zh: "已发表" }
    source: crossref
    bibtex: |-
      @article{Ge_2025, title={A multi-modal genomic knowledge distillation framework for drug response prediction}, volume={55}, ISSN={1573-7497}, url={http://dx.doi.org/10.1007/s10489-025-06768-9}, DOI={10.1007/s10489-025-06768-9}, number={12}, journal={Applied Intelligence}, publisher={Springer Science and Business Media LLC}, author={Ge, Shuang and Sun, Shuqing and Xu, Huan and Cheng, Qiang and Ren, Zhixiang}, year={2025}, month=July }
    links:
      doi: "https://doi.org/10.1007/s10489-025-06768-9"
    featured: false

  - date: 2025-07-02
    title:
      en: "Predicting protein stability changes upon mutations with dual-view ensemble learning from single sequence"
      zh: "Predicting protein stability changes upon mutations with dual-view ensemble learning from single sequence"
    authors:
      - { name: "Zhiwei Nie" }
      - { name: "Yiming Ma" }
      - { name: "Yutian Liu" }
      - { name: "Xiansong Huang" }
      - { name: "Zhihong Liu" }
      - { name: "Peng Yang" }
      - { name: "Fan Xu" }
      - { name: "Feng Yin" }
      - { name: "Zigang Li" }
      - { name: "Jie Fu" }
      - { name: "Zhixiang Ren", principal: true }
      - { name: "Wen-Bin Zhang" }
      - { name: "Jie Chen" }
    venue: "Briefings in Bioinformatics"
    venueShort: "Brief. Bioinform."
    status: { en: "Published", zh: "已发表" }
    source: crossref
    abstract: "Abstract Predicting the protein stability changes upon mutations is one of the effective ways to improve the efficiency of protein engineering. Here, we propose a dual-view ensemble learning-based framework, DVE-stability, for mutation-induced protein stability change prediction from single sequence. DVE-stability integrates the global and local dependencies of mutations to capture the intramolecular interactions from two views through ensemble learning, in which a structural microenvironment simulation module is designed to indirectly introduce the information of structural microenvironment at the sequence level. DVE-stability achieved state-of-the-art prediction performance on seven single-point mutation benchmark datasets, and comprehensively surpassed other methods on five of them. Furthermore, DVE-stability outperformed other methods comprehensively through zero-shot inference on multiple-point mutation prediction task, demonstrating superior model generalizability to capture the epistasis of multiple-point mutations. More importantly, DVE-stability exhibited superior generalization performance in predicting rare beneficial mutations that are crucial for practical protein directed evolution scenarios. In addition, DVE-stability identified important intramolecular interactions via attention scores, demonstrating interpretable. Overall, DVE-stability provides a flexible and efficient tool for mutation-induced protein stability change prediction in an interpretable ensemble learning manner."
    bibtex: |-
      @article{Nie_2025, title={Predicting protein stability changes upon mutations with dual-view ensemble learning from single sequence}, volume={26}, ISSN={1477-4054}, url={http://dx.doi.org/10.1093/bib/bbaf319}, DOI={10.1093/bib/bbaf319}, number={4}, journal={Briefings in Bioinformatics}, publisher={Oxford University Press (OUP)}, author={Nie, Zhiwei and Ma, Yiming and Liu, Yutian and Huang, Xiansong and Liu, Zhihong and Yang, Peng and Xu, Fan and Yin, Feng and Li, Zigang and Fu, Jie and Ren, Zhixiang and Zhang, Wen-Bin and Chen, Jie}, year={2025}, month=July }
    links:
      doi: "https://doi.org/10.1093/bib/bbaf319"
    featured: false

  - date: 2026-03-13
    title:
      en: "Enhanced Drug-drug Interaction Prediction Using Adaptive Knowledge Integration"
      zh: "Enhanced Drug-drug Interaction Prediction Using Adaptive Knowledge Integration"
    authors:
      - { name: "Pengfei Liu" }
      - { name: "Jun Tao" }
      - { name: "Zhixiang Ren", principal: true }
    venue: "arXiv"
    status: { en: "Preprint", zh: "预印本" }
    source: arxiv
    abstract: "Drug-drug interaction event (DDIE) prediction is crucial for preventing adverse reactions and ensuring optimal therapeutic outcomes. However, existing methods often face challenges with imbalanced datasets, complex interaction mechanisms, and poor generalization to unknown drug combinations. To address these challenges, we propose a knowledge augmentation framework that adaptively infuses prior drug knowledge into a large language model (LLM). This framework utilizes reinforcement learning techniques to facilitate adaptive knowledge extraction and synthesis, thereby efficiently optimizing the strategy space to enhance the accuracy of LLMs for DDIE predictions. As a result of few-shot learning, we achieved a notable improvement compared to the baseline. This approach establishes an effective framework for scientific knowledge learning for DDIE predictions."
    bibtex: |-
      @misc{Liu2026Enhanced,
        title = {Enhanced Drug-drug Interaction Prediction Using Adaptive Knowledge Integration},
        author = {Pengfei Liu and Jun Tao and Zhixiang Ren},
        year = {2026},
        eprint = {2603.12885},
        archivePrefix = {arXiv},
        primaryClass = {cs.LG}
      }
    links:
      arxiv: "https://arxiv.org/abs/2603.12885"
      code: "https://github.com/LingQiong-AI-Lab/Drug_drug_interaction_with_LLM"
    featured: true

  - date: 2026-05-12
    title:
      en: "Learning Protein Structure-Function Relationships through Knowledge-guided Representation Decomposition"
      zh: "Learning Protein Structure-Function Relationships through Knowledge-guided Representation Decomposition"
    authors:
      - { name: "Mingqing Wang" }
      - { name: "Zhiwei Nie" }
      - { name: "Athanasios V. Vasilakos" }
      - { name: "Yonghong He" }
      - { name: "Zhixiang Ren", principal: true }
    venue: "arXiv"
    status: { en: "Preprint", zh: "预印本" }
    source: arxiv
    abstract: "Proteins encode diverse functions within complex three-dimensional structures, yet most deep learning representations remain highly entangled, obscuring the biophysical signals that underlie function. Here we introduce ProtDiS, a knowledge-guided framework that decomposes pretrained protein micro-environment embeddings into biologically grounded and task-relevant dimensions. Inspired by the information bottleneck principle, ProtDiS learns representations that balance informativeness and compression, yielding structural features that are more specific, independent, and information-efficient, and achieving consistent improvements across twelve downstream tasks, with the largest gains under structure-based splits. Protein- and residue-level analyses further show that ProtDiS differentiates proteins with similar folds but divergent functions and captures fine-grained biophysical signals critical. These findings suggest that knowledge-guided decomposition provides a general and interpretable approach for structuring latent spaces in protein structural modeling. The source code and implementation details are publicly available at https://github.com/AI-HPC-Research-Team/ProtDiS."
    bibtex: |-
      @misc{Wang2026Learning,
        title = {Learning Protein Structure-Function Relationships through Knowledge-guided Representation Decomposition},
        author = {Mingqing Wang and Zhiwei Nie and Athanasios V. Vasilakos and Yonghong He and Zhixiang Ren},
        year = {2026},
        eprint = {2605.23960},
        archivePrefix = {arXiv},
        primaryClass = {q-bio.BM}
      }
    links:
      arxiv: "https://arxiv.org/abs/2605.23960"
      code: "https://github.com/LingQiong-AI-Lab/ProtDiS"
    featured: true

  - date: 2026-08-17
    title:
      en: "A Multitask Large Reasoning Model for Molecular Science"
      zh: "A Multitask Large Reasoning Model for Molecular Science"
    authors:
      - { name: "Pengfei Liu" }
      - { name: "Shuang Ge" }
      - { name: "Xiaobo Wang" }
      - { name: "Xin Liu" }
      - { name: "Jun Tao" }
      - { name: "Yan Li" }
      - { name: "Chao Liu" }
      - { name: "Ling Chen" }
      - { name: "Zhixiang Ren", principal: true }
    venue: "The Journal of Physical Chemistry Letters"
    venueShort: "J. Phys. Chem. Lett."
    status: { en: "Published", zh: "已发表" }
    source: crossref
    abstract: "Abstract Artificial intelligence in molecular science must move beyond pattern recognition toward chemically valid and interpretable reasoning. We present a task-adaptive large reasoning model that integrates chemical knowledge through a synergistic multispecialist architecture, chain-of-thought supervision, and molecule-informed reinforcement learning. Task-conditioned routing coordinates prediction and inference specialists across 10 molecular tasks spanning molecular description and generation, nomenclature translation, property prediction, and reaction prediction. The model outperforms more than 20 general-purpose and molecular large language models, improves aggregate performance over the base model by 50.3%, and surpasses the leading molecular multitask baseline on most tasks. Analyses of specialist representations and reasoning pathways reveal task-specific adaptation while retaining interpretable chemical inference. A case study further demonstrates an integrated workflow for central nervous system candidate generation, property screening, molecular interpretation, and retrosynthetic planning. These results demonstrate a versatile multitask framework for knowledge-guided molecular reasoning and design, with the potential to serve as a core task engine for future molecular science agents."
    bibtex: |-
      @article{Liu_2026,
        title={A Multitask Large Reasoning Model for Molecular Science},
        volume={17},
        ISSN={1948-7185},
        url={http://dx.doi.org/10.1021/acs.jpclett.6c02427},
        DOI={10.1021/acs.jpclett.6c02427},
        number={34},
        journal={The Journal of Physical Chemistry Letters},
        publisher={American Chemical Society (ACS)},
        author={Liu, Pengfei and Ge, Shuang and Wang, Xiaobo and Liu, Xin and Tao, Jun and Li, Yan and Liu, Chao and Chen, Ling and Ren, Zhixiang},
        year={2026},
        month=Aug,
        pages={9831–9843}
      }
    links:
      doi: "https://doi.org/10.1021/acs.jpclett.6c02427"
      code: "https://github.com/LingQiong-AI-Lab/Mol-Reasoning"
    featured: true
---

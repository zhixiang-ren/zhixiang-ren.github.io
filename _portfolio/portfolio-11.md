---
title: "Super-resolution of Solar Magnetograms Using Deep Learning"
excerpt: ""
collection: portfolio


---

Currently, data-driven models of solar activity forecast are investigated extensively by using machine learning. For model training, it is highly demanded to establish a large database which may contain observations coming from different instruments with different spatio-temporal resolutions. In this paper, we employ deep learning models for super-resolution (SR) of magnetogram of Michelson Doppler Imager (MDI) in order to achieve the same spatial resolution of Helioseismic and Magnetic Imager (HMI). First, a generative adversarial network (GAN) is designed to transfer characteristics of MDI onto downscaled HMI, getting low-resolution HMI magnetogram in the same domain as MDI. Then, with the paired low-resolution and high-resolution HMI magnetograms, another GAN is trained in a supervised learning way, which consists of two streams, one is for generating high-fidelity image content, the other is explicitly optimized for generating elaborate image gradients. Thus, these two streams work together to guarantee both high-fidelity and photorealistic super-resolved images. Experimental results demonstrate that the proposed method can generate super-resolved magnetograms with perceptual-pleasant visual quality. Meanwhile, the best PSNR, LPIPS, RMSE, comparable SSIM and CC are obtained by the proposed method. The source code and data set can be accessed via [https://github.com/filterbank/SPSR](https://github.com/dfpdl/SPSR).

[Download paper here](https://iopscience.iop.org/article/10.1088/1674-4527/ac78ce/meta)

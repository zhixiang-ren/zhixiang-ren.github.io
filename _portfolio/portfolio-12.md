---
title: "Image Desaturation for SDO/AIA Using Mixed Convolution Network"
excerpt: ""
collection: portfolio



---

The Atmospheric Imaging Assembly (AIA) onboard the Solar Dynamics Observatory (SDO) provides full-disk solar images with high temporal cadence and spatial resolution over seven extreme ultraviolet (EUV) wave bands. However, as violent solar flares happen, images captured in EUV wave bands may have saturation in active regions, resulting in signal loss. In this paper, we propose a deep learning model to restore the lost signal in saturated regions by referring to both unsaturated/normal regions within a solar image and statistical probability model of massive normal solar images. The proposed model, namely mixed convolution network (MCNet), is established over conditional generative adversarial network (GAN) and the combination of partial convolution (PC) and validness migratable convolution (VMC). These two convolutions were originally proposed for image inpainting. In addition, they are implemented only on unsaturated/valid pixels, followed by certain compensation to compensate the deviation of PC/VMC relative to normal convolution. Experimental results demonstrate that the proposed MCNet achieves favorable desaturated results for solar images and outperforms the state-of-the-art methods both quantitatively and qualitatively.

[Download paper here](https://iopscience.iop.org/article/10.1088/1674-4527/ac69b7/meta)

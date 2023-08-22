---
title: "Attention-Based Deep Learning Model for Image Desaturation of SDO/AIA"
excerpt: ""
collection: portfolio

---

The Atmospheric Imaging Assembly (AIA) onboard the Solar Dynamics Observatory (SDO) captures full-disk solar images in seven extreme ultraviolet wave bands. As a violent solar flare occurs, incoming photoflux may exceed the threshold of an optical imaging system, resulting in regional saturation/overexposure of images. Fortunately, the lost signal can be partially retrieved from non-local unsaturated regions of an image according to scattering and diffraction principle, which is well consistent with the attention mechanism in deep learning. Thus, an attention augmented convolutional neural network (AANet) is proposed to perform image desaturation of SDO/AIA in this paper. It is built on a U-Net backbone network with partial convolution and adversarial learning. In addition, a lightweight attention model, namely criss-cross attention, is embedded between each two convolution layers to enhance the backbone network. Experimental results validate the superiority of the proposed AANet beyond state-of-the-arts from both quantitative and qualitative comparisons.

[Download paper here](https://iopscience.iop.org/article/10.1088/1674-4527/acd595/meta)

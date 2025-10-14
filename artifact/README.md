---
layout: default
title: "Artifact Instructions"
---

This archive contains the source files and Docker configurations required to
reproduce the results of the anonymous paper submission
"Efficient Verification of Lingua Franca Models".

## 🧩 Structure

README.md (this file)  
code.zip/  
├── lf-maude/  
├── lf-mc/  
└── lf-rt-maude/  
checksum.txt

Each subfolder contains its own source files.  
`lf-maude` contains the maude intepreter for lingua-franca.  
`lf-mc` contains the lingua franca compiler that automatically translates
.lf files with analysis annotations into maude files that can be run by `lf-maude`.  
`lf-rt-maude` contains the real-time analysis for lingua-franca.

## 🐳 Docker Environment

In order to ensure a consistent environment for running the experiments, we
provide ready-built Docker images for testing. You can pull and run the
pre-built images from Github Container Registry.

To test lf-mc (contains both lf-maude and lf-mc):

```sh
docker run -it --rm ghcr.io/symbolicsafety/lf-mc:tacas26 bash -l
lfc /opt/lf-maude/examples/src/TrainDoor_v3.lf
maude /opt/lf-maude/lf-main-concrete.maude /opt/lf-maude/examples/pingPong.maude
```

To test our real-time maude analysis, a separate Docker image is provided:

```sh
docker run -it --rm ghcr.io/symbolicsafety/lf-rtm:tacas26 bash -l
maude /opt/lf-maude/RTMADAS.maude
```

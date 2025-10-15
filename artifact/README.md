---
layout: default
---

# Artifact for "Efficient Verification of Lingua Franca Models"

The [code](code.zip) archive contains the source files and Docker configurations
required to reproduce the results of our paper submission
_"Efficient Verification of Lingua Franca Models"_.

Below are instructions on how to set up the environment and run the experiments
in Docker, followed by a description of the of the sources' folder structure.

## Docker Environment

In order to ensure a consistent environment for running the experiments, we
provide ready-built Docker images for testing. You can pull and run the
pre-built images from Github Container Registry.

This requires the reviewer to have [Docker](https://www.docker.com/get-started/)
installed on their machine. [Docker desktop](https://docs.docker.com/desktop/) is
recommended for Windows and MacOS users. Linux users can follow the
installation instructions for their specific distribution.

To test `lf-mc` (contains both`lf-maude`and`lf-mc`):

<pre style="
  background-color: var(--color-canvas-default, #0d1117);
  color: var(--color-fg-default, #e6edf3);
  padding: 1em;
  border-radius: 6px;
  overflow-x: auto;
  font-family: SFMono-Regular, Consolas, monospace;
  font-size: 0.9em;
  line-height: 1.5;
  border: 1px solid var(--color-border-default, #30363d);
  position: relative;
">
  <button style="
    position: absolute;
    top: 6px;
    right: 6px;
    background: var(--color-neutral-muted, #161b22);
    color: var(--color-fg-default, #e6edf3);
    border: 1px solid var(--color-border-default, #30363d);
    border-radius: 6px;
    font-size: 0.75em;
    padding: 0.25em 0.5em;
    cursor: pointer;
  " onclick="navigator.clipboard.writeText(`docker run -it --rm ghcr.io/symbolicsafety/lf-mc:tacas26 bash -l
lfc /opt/lf-maude/examples/src/TrainDoor_v3.lf`); this.textContent='Copied!'; setTimeout(()=>this.textContent='Copy',2000);">Copy</button>
<span style="color: var(--color-success-fg, #3fb950);">user@host:~$</span> docker run -it --rm ghcr.io/symbolicsafety/lf-mc:tacas26 bash -l
<span style="color: var(--color-success-fg, #3fb950);">docker:/#</span> lfc /opt/lf-maude/examples/src/TrainDoor_v3.lf
</pre>

<!-- ```console -->
<!-- user@host:~$ $${\color{lightgreen}docker}$$ run -it --rm ghcr.io/symbolicsafety/lf-mc:tacas26 bash -l -->
<!-- docker:/# lfc /opt/lf-maude/examples/src/TrainDoor_v3.lf -->
<!-- ``` -->

We also provide native `maude` files that can be run with the following command
inside Docker:

```console
docker:/# cd /opt/lf-maude/
docker:/opt/lf-maude# maude lf-main-concrete.maude examples/pingPong.maude
```

---

To test our real-time maude analysis, a separate Docker image is provided:

```console
user@host:~$ docker run -it --rm ghcr.io/symbolicsafety/lf-rtm:tacas26 bash -l
docker:/# maude /opt/lf-maude/RTMADAS.maude
```

## Source code Structure

```
code.zip/
├── lf-maude/
├── lf-mc/
└── lf-rt-maude/
checksum.txt
```

Each subfolder contains its own source files.

### lf-maude

`lf-maude` contains the maude intepreter for lingua-franca.

```
lf-maude
├── absDynamics.maude
├── lf-main-concrete.maude
├── ...
└── examples
    ├── mod-gen
    │   ├── ADASModel
    │   │   └── ADASModel.maude
    │  ...
    │   └── UnsafeSend
    │       └── UnsafeSend.maude

    └── src
        ├── ADASModel.lf
       ...
        └── UnsafeSend.lf



```

At the root of the directory are the `.maude` files that implement the _LF_ interpreter.
The `examples` subfolder contains the case studies used in the experiments. The
`.maude` files within are hand-written translation of the verification done in
_LF-verifier_, together with additional analysis in some cases. Inside
`examples/src/` are `.lf` files of _LF-verifier_ together with annotations for
analysis and physical actions. These are the files `lf-mc` reads to automatically
generate the `.maude` files in `examples/mod-gen/`.

### lf-mc

`lf-mc` contains the lingua franca compiler that automatically translates  
_.lf_ files with analysis annotations into maude files that can be run  
by `lf-maude`.

```
lf-mc/
├ ...
├── core
│   └── src
│      ...
│       ├── main
│       │   ├── antlr
│       │   │   ├── LTLLexer.g4
│       │   │   ├── LTLParser.g4
│       │   │  ...
│       │   ├── java
│       │   │   └── org
│       │   │       └── lflang
│       │   │           ├── analyses
│       │   │           │   ├── c
│       │   │           │   │   ├── CToMaudeVisitor.java
│       │   │           │   │  ...
│       │   │           │   ├── maude
│       │   │           │   │   ├── LTLVisitor.java
│       │   │           │   │   ├── MaudeGenerator.java
│       │   │           │   │  ...
... # other files ommitted for brevity


```

This is a `Java` project built using `gradle`. The build used for this submission
is included in the docker image referenced above, but also available
[here](lf-mc-1.1-package.tar.gz) (requires `java 1.7`). In order to build the
project from source use the `./gradlew assemble` command at the root of the `lf-mc` folder.

### LF-RT-MAUDE

`lf-rt-maude` contains the real-time analysis support for lingua-franca programs.
This requires `maude 2.7` to run, which conflicts with newer versions of `maude`
and is the reason a separate Docker image has been provided.

```
lf-rt-maude
├── alarm.maude
├── pingPong.maude
├── RTM-ADAS.maude
├── rtm-aircraft-door.maude
├─ ...
├── thermostat.maude
└── TrainDoor_v3.maude
```

The `.maude` files shown above contain analysis done using timed CTL model checking.

---
layout: default
---

<style>
.command-block {
  background-color: var(--color-canvas-subtle, #f6f8fa);  /* likely matches light-mode code background */
  color: var(--color-fg-default, #24292e);               /* default text color */
  padding: 1em;
  border-radius: 6px;
  overflow-x: auto;
  font-family: SFMono-Regular, Consolas, monospace;
  font-size: 0.9em;
  line-height: 1.5;
  border: 1px solid var(--color-border-default, #d0d7de);
  position: relative;
  margin-bottom: 1em;
}
.command-block .prompt {
  color: var(--color-success-fg, #1f6feb);
}
.command-block button {
  position: absolute;
  top: 6px;
  right: 6px;
  background: var(--color-neutral-muted, #f0f0f0);
  color: var(--color-fg-default, #24292e);
  border: 1px solid var(--color-border-default, #d0d7de);
  border-radius: 6px;
  font-size: 0.75em;
  padding: 0.25em 0.5em;
  cursor: pointer;
  transition: background 0.2s ease;
}
.command-block button:hover {
  background: var(--color-neutral-subtle, #e1e4e8);
}
.command-block button.copied {
  color: var(--color-success-fg, #1f6feb);
  border-color: var(--color-success-fg, #1f6feb);
}
</style>

<script>
function copyCommand(btn) {
  const cmd = btn.getAttribute('data-command');
  navigator.clipboard.writeText(cmd);
  btn.textContent = 'Copied!';
  btn.classList.add('copied');
  setTimeout(() => {
    btn.textContent = 'Copy';
    btn.classList.remove('copied');
  }, 2000);
}
</script>

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

To test `lf-mc` (contains both `lf-maude` and `lf-mc`):

<div class="command-block">
  <button onclick="copyCommand(this)" data-command="docker run -it --rm ghcr.io/symbolicsafety/lf-mc:tacas26 bash -l">Copy</button>
  <span class="prompt">user@host:~$</span> docker run -it --rm ghcr.io/symbolicsafety/lf-mc:tacas26 bash -l
</div>

<div class="command-block">
  <button onclick="copyCommand(this)" data-command="lfc /opt/lf-maude/examples/src/TrainDoor_v3.lf">Copy</button>
  <span class="prompt">docker:/#</span> lfc /opt/lf-maude/examples/src/TrainDoor_v3.lf
</div>

<!-- First command block -->

<!-- Second command block -->

We also provide native `maude` files that can be run with the following command
inside Docker:

<div class="command-block">
  <button onclick="copyCommand(this)" data-command="cd /opt/lf-maude/
maude lf-main-concrete.maude examples/pingPong.maude">Copy</button>
  <span class="prompt">docker:/#</span> cd /opt/lf-maude/
maude lf-main-concrete.maude examples/pingPong.maude
</div>

---

To test our real-time maude analysis, a separate Docker image is provided:

<div class="command-block">
  <button onclick="copyCommand(this)" data-command="docker run -it --rm ghcr.io/symbolicsafety/lf-rtm:tacas26 bash -l">Copy</button>
  <span class="prompt">user@host:~$</span> docker run -it --rm ghcr.io/symbolicsafety/lf-rtm:tacas26 bash -l
</div>

<div class="command-block">
  <button onclick="copyCommand(this)" data-command="maude /opt/lf-maude/RTM-ADCAS.maude">Copy</button>
  <span class="prompt">docker:/#</span> maude /opt/lf-maude/RTM-ADCAS.maude
</div>

<!-- ```console -->
<!-- user@host:~$ docker run -it --rm ghcr.io/symbolicsafety/lf-rtm:tacas26 bash -l -->
<!-- docker:/# maude /opt/lf-maude/RTMADAS.maude -->
<!-- ``` -->

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
_LF-verifier_, together with additional analysis in some cases.  
Inside `examples/src/` are `.lf` files of _LF-verifier_ together with annotations for
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

# Rubik's Cube Agent

All-in-one Rubik's cube simulator to help improve your solving. In its current state, it is merely just a 3D interactive Rubik's cube to visualize your solves. However, I plan to implement much more to it, including an Agentic AI feature to analyze solves and give feedback.

Check it out now at [https://cruidgals.github.io/rubiks-cube-agent/](https://cruidgals.github.io/rubiks-cube-agent/).

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

To begin running this project, you must first have [Node.js](https://nodejs.org/en) installed. After that, run this command:

```
npm install -g yarn
```

to install **yarn**, the package manager used in this project You may also verify the installation by running `yarn --version`

From there, install the modules with the following command:

```
yarn
```

After that, you can open the project your local machine with the command

```
yarn run dev
```

## Built With

* [Vue.js](https://vuejs.org/) - Driving framework for this project
* [TresJS](https://tresjs.org/) - declarative, component driven 3D engine built on top of Three.js, and made specifically for Vue.js
* [FontAwesome Icons](https://fontawesome.com/) - for the cool icons used in this project
* [GSAP](https://gsap.com/) - for the clean animation of turning the Rubik's cube
* [Markdown-It](https://github.com/markdown-it/markdown-it) - used to display markdown throughout the website

## File Structure

```
rubiks-cube-agent/
├── index.html              # Main HTML entry point
├── package.json            # Project dependencies and scripts
├── vite.config.js          # Vite configuration
├── jsconfig.json           # JavaScript configuration
├── public/
│   └── rubik.png           # Rubik's cube image asset
├── src/
│   ├── main.js             # Application entry point
│   ├── App.vue             # Root Vue component
│   ├── assets/
│   │   ├── base.css        # Base styles
│   │   ├── main.css        # Main stylesheet
│   │   ├── fonts/
│   │   │   └── Roboto_Regular.json
│   │   └── keybinds.md     # Keyboard bindings documentation
│   ├── components/
│   │   ├── Controls.vue    # Cube control interface
│   │   ├── Modal.vue       # Modal component
│   │   ├── RubiksCube.vue  # Main Rubik's cube component
│   │   ├── SceneShell.vue  # 3D scene wrapper
│   │   └── Slider.vue      # Slider UI component
│   └── composables/
│       ├── cameraControls.ts  # Camera control logic
│       ├── cubeLogic.ts       # Core cube solving logic
│       ├── cubeVisual.ts      # Cube visualization logic
│       ├── playMoveLogic.ts   # Move execution logic
│       └── util.ts            # Utility functions
└── README.md               # Project documentation
```

## Acknowledgments

* HUGE inspiration from past 3D Rubik's cube simulators like [cubedb.net](https://cubedb.net/) for the simulation part.

import { motion } from "framer-motion";
import Head from "next/head";
import React from "react";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.background}>
      <Head>
        <title>Orbital Resonance</title>
        <meta
          name="description"
          content="Demonstration of orbital resonance. Orbital resonance occurs when orbiting bodies exert regular, periodic gravitational influence on each other, usually because their orbital periods are related by a ratio of small integers."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SolarSystem></SolarSystem>
    </div>
  );
}

class SolarSystem extends React.Component {
  state = {
    planets: [],
    planetsCross: [],
    orbitalRatios: [1, 2],
    isMenuOpen: false,
    width: 0,
    height: 0,
    isMounted: true,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.setState({
      width: window.innerWidth / 2,
      height: window.innerHeight / 2,
    });

    this.generateRandomPlanets(this.state.orbitalRatios, () =>
      this.updatePlanetsPositions(
        this.state.planets.map((planet) => planet.angle)
      )
    );
  }

  componentWillUnmount() {
    this.setState({
      isMounted: false,
    });
  }

  generateRandomPlanets(orbitalRatios, callback) {
    const genRanHex = (size) =>
      [...Array(size)]
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join("");

    let newPlanets = [];
    for (let ratio of orbitalRatios) {
      let radius = Array.from(
        { length: orbitalRatios.length },
        (_, i) => i + 1
      ).map(
        (num) =>
          (num / orbitalRatios.length) *
          Math.min(window.innerWidth / 2, window.innerHeight / 2)
      )[orbitalRatios.indexOf(ratio)];

      newPlanets.push(
        new Planet(
          Math.random() * 2 * Math.PI,
          ratio * 50,
          radius,
          [15, 20, 25, 30][Math.floor(Math.random() * 4)],
          "#" + genRanHex(6)
        )
      );
    }

    this.setState(
      {
        planets: newPlanets,
        planetsCross: Array.from(
          { length: newPlanets.length },
          (_, i) => false
        ),
      },
      callback
    );
  }

  endAnimation(i) {
    let newPlanetsCross = this.state.planetsCross;
    newPlanetsCross[i] = false;
    this.setState({ planetsCross: newPlanetsCross });
  }

  updatePlanetsPositions(previousAngles) {
    let newPlanets = [];
    let newPlanetsCross = [...previousAngles.map((i) => false)];
    for (let planet of this.state.planets) {
      newPlanets.push(planet.updatePosition(0.05));

      for (let previousAngle of previousAngles) {
        if (
          previousAngle < planet.angle &&
          previousAngles.indexOf(previousAngle) !=
            this.state.planets.indexOf(planet)
        ) {
          newPlanetsCross[this.state.planets.indexOf(planet)] = true;
          // newPlanetsCross[previousAngles.indexOf(previousAngle)] = true;
        }
      }
    }

    this.setState({ planets: newPlanets, planetsCross: newPlanetsCross });

    if (this.state.isMounted) {
      setTimeout(() => {
        this.updatePlanetsPositions(newPlanets.map((planet) => planet.angle));
      }, 1);
    }
  }

  render() {
    return (
      <div>
        <div>
          <div className={styles.sun}></div>
          {this.state.planets.map((planet) =>
            this.FormPlanet(
              this.state.planets[this.state.planets.indexOf(planet)].x,
              this.state.planets[this.state.planets.indexOf(planet)].y,
              this.state.width,
              this.state.height,
              planet
            )
          )}
        </div>
        {this.state.isMenuOpen && <div></div>}
      </div>
    );
  }

  FormPlanet(x, y, centreX, centreY, planet) {
    return (
      <motion.div
        key={this.state.planets.indexOf(planet)}
        className={styles.planet}
        initial={{
          x: centreX - planet.size / 2,
          y: centreY - planet.size / 2,
        }}
        animate={{
          x: x * planet.radius + centreX - planet.size / 2,
          y: y * planet.radius + centreY - planet.size / 2,
        }}
        transition={{
          type: "spring",
          damping: 5,
          mass: 0.1,
        }}
        style={{
          height: planet.size,
          width: planet.size,
          borderRadius: planet.size,
          backgroundColor: planet.colour,
        }}
      >
        <div
          className={
            this.state.planetsCross[this.state.planets.indexOf(planet)]
              ? `${styles.innerPlanet} ${styles.ding}`
              : styles.innerPlanet
          }
          onAnimationStart={() => console.log("animation started")}
          onAnimationEnd={() => this.setState({})}
        ></div>
      </motion.div>
    );
  }
}

class Planet {
  angle = 0;
  x = 1;
  y = 0;

  orbitalPeriod = 1;
  radius = 200;
  size = 20;
  colour = "red";

  constructor(angle, orbitalPeriod, radius, size, colour) {
    this.angle = angle;
    this.orbitalPeriod = orbitalPeriod;
    this.radius = radius;
    this.size = size;
    this.colour = colour;
  }

  updatePosition() {
    this.angle += 1 / this.orbitalPeriod;
    if (this.angle > 2 * Math.PI) {
      this.angle -= 2 * Math.PI;
    }
    this.x = Math.cos(this.angle);
    this.y = Math.sin(this.angle);
    return this;
  }
}

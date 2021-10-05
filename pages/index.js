import { motion } from "framer-motion";
import Head from "next/head";
import Image from "next/image";
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
    planets: [
      // new Planet(0, 100, 200, 20, "red"),
      // new Planet(0, 50, 300, 40, "yellow"),
    ],
    orbitalRatios: [1, 2, 3, 6],
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

    const genRanHex = (size) =>
      [...Array(size)]
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join("");

    let newPlanets = [];
    for (let ratio of this.state.orbitalRatios) {
      let radius = Array.from(
        { length: this.state.orbitalRatios.length },
        (_, i) => i + 1
      ).map(
        (num) =>
          (num / this.state.orbitalRatios.length) *
          Math.min(window.innerWidth / 2, window.innerHeight / 2)
      )[this.state.orbitalRatios.indexOf(ratio)];

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
      },
      () => this.updatePlanetsPositions()
    );
  }

  componentWillUnmount() {
    this.setState({
      isMounted: false,
    });
  }

  updatePlanetsPositions() {
    let newPlanets = [];
    for (let planet of this.state.planets) {
      newPlanets.push(planet.updatePosition(0.05));
    }

    this.setState({ planets: newPlanets });

    if (this.state.isMounted) {
      setTimeout(() => {
        this.updatePlanetsPositions();
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
          damping: 50,
          mass: 3,
        }}
        style={{
          height: planet.size,
          width: planet.size,
          borderRadius: planet.size,
          backgroundColor: planet.colour,
        }}
      ></motion.div>
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

import React, { useState, useCallback, useRef } from "react";
import produce from "immer";
import { Button } from "@material-ui/core";
import "fontsource-roboto";
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import "./App.css";

let currentGen = 0;
let currentSpeed = 500;

function App() {
  const [rows] = useState(60);
  const [columns] = useState(60);
  const [start, setStart] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [randomValue, setRandomValue] = useState({ newRandom: "0.5" });
  const [newSpeed, setNewSpeed] = useState(currentSpeed / 1000);
  const [color, setColor] = useState({
    cellColor: "Green" || "",
    backgroundColor: "White" || "",
  });
  const startRef = useRef();
  startRef.current = start;
  const [grid, setGrid] = useState(() => {
    const gridRows = [];
    for (let i = 0; i < rows; i++) {
      gridRows.push(Array.from(Array(columns), () => 0));
    }
    return gridRows;
  });

  const coordinates = [
    [0, 1],
    [0, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
    [-1, -1],
    [1, 0],
    [-1, 0],
  ];

  const speedChanger = (value) => {
    if (value === 1) {
      currentSpeed = currentSpeed + 100;
    }
    if (value === 2 && currentSpeed !== 0) {
      currentSpeed = currentSpeed - 100;
    }

    setNewSpeed(currentSpeed / 1000);
  };

  const handleChange = (event) => {
    const name = event.target.name;

    setColor({
      ...color,
      [name]: event.target.value,
    });

    setRandomValue({
      ...randomValue.newRandom,
      [name]: event.target.value,
    });
    console.log(randomValue);
  };
  const randomizer = (a) => {
    const gridRows = [];
    for (let i = 0; i < rows; i++) {
      gridRows.push(
        Array.from(Array(columns), () => (Math.random() > a ? 0 : 1))
      );
    }
    setGrid(gridRows);
  };

  const reset = () => {
    currentGen = 0;
    setGrid(() => {
      const gridRows = [];
      for (let i = 0; i < rows; i++) {
        gridRows.push(Array.from(Array(columns), () => 0));
      }
      return gridRows;
    });
  };

  const stepForward = () => {
    currentGen += 1;
    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < columns; j++) {
            let cells = 0;
            coordinates.forEach(([x, y]) => {
              const nextI = i + x;
              const nextJ = j + y;
              if (nextI >= 0 && nextI < rows && nextJ >= 0 && nextJ < columns) {
                cells += g[nextI][nextJ];
              }
            });

            if (cells < 2 || cells > 3) {
              gridCopy[i][j] = 0;
            } else if (g[i][j] === 0 && cells === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      });
    });
  };

  const startGame = useCallback(() => {
    if (!startRef.current) {
      return;
    }
    currentGen += 1;
    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < columns; j++) {
            let cells = 0;
            coordinates.forEach(([x, y]) => {
              const nextI = i + x;
              const nextJ = j + y;
              if (nextI >= 0 && nextI < rows && nextJ >= 0 && nextJ < columns) {
                cells += g[nextI][nextJ];
              }
            });

            if (cells < 2 || cells > 3) {
              gridCopy[i][j] = 0;
            } else if (g[i][j] === 0 && cells === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      });
    });
    setGeneration(currentGen);

    setTimeout(startGame, currentSpeed);
  });

  return (
    <div className="grid-container">
      <div className="main-container">
        <div className="generation-display">
          <Typography variant="h4" component="h2">
            Current Generation {currentGen}
          </Typography>
        </div>
        <div class="button-container">
          <Button
            color="primary"
            variant="outlined"
            onClick={() => {
              speedChanger(2);
            }}
          >
            Decrease Speed -
          </Button>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => {
              speedChanger(1);
            }}
          >
            Increase Speed +
          </Button>
          <Typography
            variant="h6"
            component="h2"
            style={{ marginLeft: `6%`, marginTop: `2%` }}
          >
            Current Speed {newSpeed} Seconds
          </Typography>
        </div>
        <div class="colorpicker">
          <InputLabel htmlFor="filled-age-native-simple">Cell Color</InputLabel>
          <Select
            native
            value={color.cellColor}
            onChange={handleChange}
            inputProps={{
              name: "cellColor",
              id: "filled-age-native-simple",
            }}
          >
            <option label={color.cellColor} value={color.cellColor} />
            <option value={"Green"}>Green</option>
            <option value={"Red"}>Red</option>
            <option value={"Yellow"}>Yellow</option>
            <option value={"Black"}>Black</option>
            <option value={"Orange"}>Orange</option>
            <option value={"Purple"}>Purple</option>
            <option value={"Pink"}>Pink</option>
          </Select>
          <InputLabel htmlFor="filled-age-native-simple">
            Background Color
          </InputLabel>
          <Select
            native
            value={color.backgroundColor}
            onChange={handleChange}
            inputProps={{
              name: "backgroundColor",
              id: "filled-age-native-simple",
            }}
          >
            <option
              label={color.backgroundColor}
              value={color.backgroundColor}
            />
            <option value={"White"}>White</option>
            <option value={"Green"}>Green</option>
            <option value={"Red"}>Red</option>
            <option value={"Yellow"}>Yellow</option>
            <option value={"Black"}>Black</option>
            <option value={"Orange"}>Orange</option>
            <option value={"Purple"}>Purple</option>
            <option value={"Pink"}>Pink</option>
          </Select>
        </div>
        <div class="buttons">
          {!start ? (
            <Button
              color="primary"
              variant="contained"
              onClick={() => {
                setStart(!start);
                startRef.current = true;
                startGame();
              }}
            >
              Start
            </Button>
          ) : (
            <Button
              color="secondary"
              variant="contained"
              onClick={() => {
                setStart(!start);
                startRef.current = false;
                startGame();
              }}
            >
              Stop
            </Button>
          )}
          <Button
            onClick={() => {
              stepForward();
            }}
          >
            Step Forward »
          </Button>
          <Button
            onClick={() => {
              reset();
            }}
          >
            Reset
          </Button>
        </div>
        <Button
          onClick={() => {
            randomizer(0.3);
          }}
        >
          Random
        </Button>
      </div>

      <div
        className="grid"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 12px)`,
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, j) => (
            <div
              key={`${i}-${j}`}
              onClick={() => {
                const newGrid = produce(grid, (gridCopy) => {
                  gridCopy[i][j] = grid[i][j] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              style={{
                width: 10,
                height: 10,
                backgroundColor: grid[i][j]
                  ? `${color.cellColor}` || "green"
                  : `${color.backgroundColor}`,
                border: "solid 1px lightgrey",
              }}
            />
          ))
        )}
      </div>
      <div className="text">
        <Typography variant="h4" component="h4">
          Conway's Game of Life
        </Typography>
        <Typography variant="body2" component="h6">
          "The Game of Life is not your typical computer game. It is a 'cellular
          automaton', and was invented by Cambridge mathematician John Conway.
          This game became widely known when it was mentioned in an article
          published by Scientific American in 1970. It consists of a collection
          of cells which, based on a few mathematical rules, can live, die or
          multiply. Depending on the initial conditions, the cells form various
          patterns throughout the course of the game." -
          <a href="https://bitstorm.org/gameoflife/">GameOfLife</a>
        </Typography>
        <Typography variant="h6" component="h5">
          Rules of Conway's Game of Life
        </Typography>
        <Typography variant="body2" component="h6">
          <ol>
            <li>
              Any live cell with fewer than two live neighbours dies, as if by
              underpopulation.
            </li>{" "}
            <li>
              Any live cell with two or three live neighbours lives on to the
              next generation.
            </li>
            <li>
              {" "}
              Any live cell with more than three live neighbours dies, as if by
              overpopulation.
            </li>
            <li>
              {" "}
              Any dead cell with exactly three live neighbours becomes a live
              cell, as if by reproduction.
            </li>
          </ol>
          These rules, which compare the behavior of the automaton to real life,
          can be condensed into the following:
          <ol>
            <li> Any live cell with two or three live neighbours survives.</li>
            <li>
              {" "}
              Any dead cell with three live neighbours becomes a live cell.
            </li>
            <li>
              {" "}
              All other live cells die in the next generation. Similarly, all
              other dead cells stay dead.
            </li>
          </ol>
        </Typography>
      </div>
    </div>
  );
}

export default App;

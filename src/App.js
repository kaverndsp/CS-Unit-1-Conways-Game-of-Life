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

function App(props) {
  const [rows, setRows] = useState(60);
  const [columns, setColumns] = useState(60);
  const [start, setStart] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [newSpeed, setNewSpeed] = useState(currentSpeed / 1000);
  const [color, setColor] = useState({
    cellColor: null || "",
    backgroundColor: null || "",
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
  const changeGrid = (a, b) => {
    setColumns(a);
    setRows(b);

    setGrid(() => {
      const gridRows = [];
      for (let i = 0; i < rows; i++) {
        gridRows.push(Array.from(Array(columns), () => 0));
      }
      return gridRows;
    });
  };

  const handleChange = (event) => {
    const name = event.target.name;

    setColor({
      ...color,
      [name]: event.target.value,
    });
    console.log(color);
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
  }, []);

  return (
    <div className="grid-container">
      <div className="button-container">
        <Typography variant="h4" component="h2">
          Current Generation {currentGen}
        </Typography>
        {/* <Button
          color="primary"
          variant="outlined"
          onClick={() => changeGrid(10, 10)}
        >
          10 x 10
        </Button>
        <Button
          color="primary"
          variant="outlined"
          onClick={() => changeGrid(25, 25)}
        >
          25 x 25
        </Button>
        <Button
          color="primary"
          variant="outlined"
          onClick={() => changeGrid(50, 50)}
        >
          50 x 50 (Default)
        </Button> */}
        <div>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => {
              speedChanger(2);
            }}
          >
            Decrease Speed
          </Button>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => {
              speedChanger(1);
            }}
          >
            Increase Speed
          </Button>
          <Typography variant="h6" component="h2">
            Current Speed {newSpeed} Seconds
          </Typography>
        </div>

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
          <option label={color.backgroundColor} value={color.backgroundColor} />
          <option value={"White"}>White</option>
          <option value={"Green"}>Green</option>
          <option value={"Red"}>Red</option>
          <option value={"Yellow"}>Yellow</option>
          <option value={"Black"}>Black</option>
          <option value={"Orange"}>Orange</option>
          <option value={"Purple"}>Purple</option>
          <option value={"Pink"}>Pink</option>
        </Select>
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
            className="generation-display"
            color="primary"
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
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Neque
          viverra justo nec ultrices dui sapien eget mi. Sodales ut etiam sit
          amet nisl purus in mollis. Gravida dictum fusce ut placerat orci nulla
          pellentesque. Donec adipiscing tristique risus nec feugiat in
          fermentum. At ultrices mi tempus imperdiet nulla malesuada
          pellentesque elit eget. Massa tincidunt dui ut ornare lectus.
          Curabitur vitae nunc sed velit dignissim sodales ut eu sem. Duis at
          tellus at urna condimentum mattis pellentesque. Arcu vitae elementum
          curabitur vitae nunc sed velit dignissim sodales. Pharetra pharetra
          massa massa ultricies. In massa tempor nec feugiat nisl pretium fusce
          id. A lacus vestibulum sed arcu non. Diam maecenas ultricies mi eget
          mauris pharetra et ultrices. Nisl vel pretium lectus quam id leo in
          vitae. Purus gravida quis blandit turpis cursus. Odio tempor orci
          dapibus ultrices in iaculis. Donec ac odio tempor orci dapibus
          ultrices in iaculis nunc. Amet consectetur adipiscing elit duis
          tristique sollicitudin nibh sit. Molestie ac feugiat sed lectus
          vestibulum mattis. Faucibus a pellentesque sit amet porttitor eget
          dolor morbi. Viverra nibh cras pulvinar mattis. Turpis egestas integer
          eget aliquet nibh praesent. In hac habitasse platea dictumst quisque.
          Et magnis dis parturient montes nascetur ridiculus mus mauris vitae.
          Curabitur vitae nunc sed velit dignissim sodales ut eu sem. Mattis
          aliquam faucibus purus in massa tempor. Iaculis at erat pellentesque
          adipiscing commodo elit. Scelerisque viverra mauris in aliquam sem.
          Ullamcorper eget nulla facilisi etiam dignissim. Sed risus ultricies
          tristique nulla aliquet enim. Cras adipiscing enim eu turpis egestas.
          Etiam erat velit scelerisque in.
        </p>
      </div>
    </div>
  );
}

export default App;

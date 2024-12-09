import { useEffect, useState } from "react";
import { Stage, Layer, Rect, Circle, Line } from "react-konva";

const App = () => {
  const [shapes, setShapes] = useState([{}]);
  const [tool, setTool] = useState("rectangle"); // Tool selection: 'rectangle', 'circle', 'line', 'freehand'
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentLine, setCurrentLine] = useState([]);

  useEffect(() => {
    console.log(shapes);
  }, [shapes]);

  const handleMouseDown = (e) => {
    const { x, y } = e.target.getStage().getPointerPosition();

    switch (tool) {
      case "freehand":
        setIsDrawing(true);
        setCurrentLine([x, y]);
        break;

      case "line":
        setCurrentLine([x, y]);
        break;
    }
  };

  const handleMouseMove = (e) => {
    const { x, y } = e.target.getStage().getPointerPosition();

    switch (tool) {
      case "freehand":
        if (isDrawing) {
          setCurrentLine((prevLine) => [...prevLine, x, y]);

          if (
            shapes[shapes.length - 1]?.type === "line" &&
            shapes[shapes.length - 1]?.MouseMove
          ) {
            setShapes((prevShapes) => [
              ...prevShapes.slice(0, prevShapes.length - 1),
              { type: "line", points: currentLine, MouseMove: true },
            ]);
          } else {
            setShapes((prevShapes) => [
              ...prevShapes,
              { type: "line", points: currentLine, MouseMove: true },
            ]);
          }
        }
        break;

      case "line":
        if (currentLine.length >= 2) {
          setCurrentLine((prevLine) => [...prevLine.slice(0, 2), x, y]);

          // Update the last line shape in the shapes array
          setShapes((prevShapes) => {
            if (
              prevShapes[prevShapes.length - 1]?.MouseMove &&
              prevShapes[prevShapes.length - 1]?.type === "line"
            ) {
              return [
                ...prevShapes.slice(0, prevShapes.length - 1),
                {
                  type: "line",
                  points: [...currentLine, x, y],
                  MouseMove: true,
                },
              ];
            } else {
              return [
                ...prevShapes,
                {
                  type: "line",
                  points: [...currentLine],
                  MouseMove: true,
                },
              ];
            }
          });
        }
        break;

      default:
        // Optionally handle other tools or cases
        break;
    }
  };

  const handleMouseUp = (e) => {
    const { x, y } = e.target.getStage().getPointerPosition();

    switch (tool) {
      case "freehand":
        if (isDrawing) {
          setShapes((prevShapes) => [
            ...prevShapes.slice(0, prevShapes.length - 1),
            { type: "line", points: currentLine },
          ]);
          setCurrentLine([]);
          setIsDrawing(false);
        }
        break;

      case "line":
        setShapes((prevShapes) => [
          ...prevShapes.slice(0, prevShapes.length - 1),
          { type: "line", points: [...currentLine.slice(0, 2), x, y] },
        ]);
        setCurrentLine([]);
        break;

      default:
        // Optionally handle other tools or cases
        break;
    }
  };

  const addShape = (e) => {
    const { x, y } = e.target.getStage().getPointerPosition();

    if (tool !== "freehand") {
      setShapes((prevShapes) => [
        ...prevShapes,
        { type: tool, x: x, y: y, width: 100, height: 100, radius: 50 },
      ]);
    }
  };

  return (
    <div>
      <div>
        <button onClick={() => setTool("rectangle")}>Rectangle</button>
        <button onClick={() => setTool("circle")}>Circle</button>
        <button onClick={() => setTool("line")}>Line</button>
        <button onClick={() => setTool("freehand")}>Freehand</button>
        <button onClick={addShape}>Add Shape</button>
      </div>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={addShape}
      >
        <Layer>
          {shapes.map((shape, index) => {
            if (shape.type === "rectangle") {
              return (
                <Rect
                  key={index}
                  x={shape.x}
                  y={shape.y}
                  width={shape.width}
                  height={shape.height}
                  fill="blue"
                  draggable
                />
              );
            }
            if (shape.type === "circle") {
              return (
                <Circle
                  key={index}
                  x={shape.x}
                  y={shape.y}
                  radius={shape.radius}
                  fill="green"
                  draggable
                  onDragMove={(e) => {
                    console.log(e.target._id);
                  }}
                />
              );
            }
            if (shape.type === "line") {
              return (
                <Line
                  key={index}
                  points={shape.points}
                  stroke="red"
                  strokeWidth={2}
                  tension={0.5}
                  lineCap="round"
                />
              );
            }
            return null;
          })}
        </Layer>
      </Stage>
    </div>
  );
};

export default App;

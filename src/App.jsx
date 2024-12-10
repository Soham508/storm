import { useEffect, useState } from "react";
import { Stage, Layer, Rect, Arrow, Ellipse } from "react-konva";
import { nanoid } from "nanoid";

const App = () => {
  const [shapes, setShapes] = useState([{}]);
  const [tool, setTool] = useState("rectangle"); // Tool selection: 'rectangle', 'circle', 'line', 'freehand'
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentLine, setCurrentLine] = useState([]);
  const [dragState, setDragState] = useState({
    dragging: false,
    id: undefined,
  });
  const [startPosition, setStartPosition] = useState(undefined);

  useEffect(() => {
    console.log(shapes);
  }, [shapes, startPosition]);

  const handleDragStart = (e) => {
    const id = e.target.id();
    setDragState({ dragging: true, id: id });
  };

  const handleDragEnd = () => {
    setDragState({ dragging: false, id: undefined });
  };

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

      default:
        setStartPosition({ startX: x, startY: y });
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

      case "ellipse":
        if (startPosition) {
          const radiusX = Math.abs(startPosition.startX - x) / 2;
          const radiusY = Math.abs(startPosition.startY - y) / 2;

          setShapes((prevShapes) => {
            if (
              prevShapes[prevShapes.length - 1]?.MouseMove &&
              prevShapes[prevShapes.length - 1]?.type === "ellipse"
            ) {
              return [
                ...prevShapes.slice(0, prevShapes.length - 1),
                {
                  id: nanoid(),
                  type: "ellipse",
                  x:
                    x > startPosition.startX
                      ? startPosition.startX + radiusX
                      : x + radiusX,
                  y:
                    y > startPosition.startY
                      ? startPosition.startY + radiusY
                      : y + radiusY,
                  radiusX,
                  radiusY,
                  MouseMove: true,
                },
              ];
            } else {
              return [
                ...prevShapes,
                {
                  id: nanoid(),
                  type: "ellipse",
                  x:
                    x > startPosition.startX
                      ? startPosition.startX + radiusX
                      : x + radiusX,
                  y:
                    y > startPosition.startY
                      ? startPosition.startY + radiusY
                      : y + radiusY,
                  radiusX,
                  radiusY,
                  MouseMove: true,
                },
              ];
            }
          });
        }
        break;

      case "rectangle":
        if (startPosition) {
          setShapes((prevShapes) => {
            const width = Math.abs(x - startPosition.startX);
            const height = Math.abs(y - startPosition.startY);

            const rectX = x > startPosition.startX ? startPosition.startX : x;
            const rectY = y > startPosition.startY ? startPosition.startY : y;

            if (
              prevShapes[prevShapes.length - 1]?.MouseMove &&
              prevShapes[prevShapes.length - 1]?.type === "rectangle"
            ) {
              return [
                ...prevShapes.slice(0, prevShapes.length - 1),
                {
                  id: nanoid(),
                  type: "rectangle",
                  x: rectX,
                  y: rectY,
                  width: width,
                  height: height,
                  MouseMove: true,
                  color: "white",
                },
              ];
            } else {
              return [
                ...prevShapes,
                {
                  id: nanoid(),
                  type: "rectangle",
                  x: rectX, // Corrected x position
                  y: rectY, // Corrected y position
                  width: width, // Positive width
                  height: height, // Positive height
                  MouseMove: true,
                  color: "white",
                },
              ];
            }
          });
        }
        break;

      default:
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
            { id: nanoid(), type: "line", points: currentLine },
          ]);
          setCurrentLine([]);
          setIsDrawing(false);
        }
        break;

      case "line":
        setShapes((prevShapes) => [
          ...prevShapes.slice(0, prevShapes.length - 1),
          {
            id: nanoid(),
            type: "line",
            points: [...currentLine.slice(0, 2), x, y],
            color: "white",
          },
        ]);
        setCurrentLine([]);
        break;

      case "ellipse":
        if (startPosition) {
          const radiusX = Math.abs(startPosition.startX - x) / 2;
          const radiusY = Math.abs(startPosition.startY - y) / 2;

          setShapes((prevShapes) => [
            ...prevShapes.slice(0, prevShapes.length - 1),
            {
              id: nanoid(),
              type: "ellipse",
              x:
                x > startPosition.startX
                  ? startPosition.startX + radiusX
                  : x + radiusX,
              y:
                y > startPosition.startY
                  ? startPosition.startY + radiusY
                  : y + radiusY,
              radiusX,
              radiusY,
            },
          ]);
          setStartPosition(undefined);
        }
        break;

      case "rectangle":
        setShapes((prevShapes) => {
          const width = Math.abs(x - startPosition.startX);
          const height = Math.abs(y - startPosition.startY);

          const rectX = x > startPosition.startX ? startPosition.startX : x;
          const rectY = y > startPosition.startY ? startPosition.startY : y;

          return [
            ...prevShapes.slice(0, prevShapes.length - 1),
            {
              id: nanoid(),
              type: "rectangle",
              x: rectX,
              y: rectY,
              width: width,
              height: height,
              color: "white",
            },
          ];
        });

        setStartPosition(undefined);
        break;

      default:
        break;
    }
  };

  const addShape = (e) => {
    const { x, y } = e.target.getStage().getPointerPosition();

    if (tool !== "freehand") {
      setShapes((prevShapes) => [
        ...prevShapes,
        {
          id: nanoid(),
          type: tool,
          x: x,
          y: y,
          width: 100,
          height: 100,
          radius: 50,
        },
      ]);
    }
  };

  return (
    <div>
      <div>
        <button onClick={() => setTool("rectangle")}>Rectangle</button>
        <button onClick={() => setTool("ellipse")}>Ellipse</button>
        <button onClick={() => setTool("line")}>Line</button>
        <button onClick={() => setTool("freehand")}>Freehand</button>
        <button onClick={() => setTool("")}>Free</button>
        <button onClick={addShape}>Add Shape</button>
      </div>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          {shapes.map((shape, index) => {
            if (shape.type === "rectangle") {
              return (
                <Rect
                  key={index}
                  id={shape.id}
                  x={shape.x}
                  y={shape.y}
                  width={shape.width}
                  height={shape.height}
                  stroke={shape.color || "white"}
                  shadowColor="white"
                  shadowBlur={15}
                  shadowOpacity={0.9}
                  shadowOffsetX={
                    dragState.dragging && shape.id == dragState.id ? 6 : 0
                  }
                  shadowOffsetY={
                    dragState.dragging && shape.id == dragState.id ? 6 : 0
                  }
                  scaleX={
                    dragState.dragging && shape.id == dragState.id ? 1.05 : 1
                  }
                  scaleY={
                    dragState.dragging && shape.id == dragState.id ? 1.05 : 1
                  }
                  draggable
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                />
              );
            }
            if (shape.type === "ellipse") {
              return (
                <Ellipse
                  key={index}
                  id={shape.id}
                  x={shape.x}
                  y={shape.y}
                  fillPatternOffset={[100, 200]}
                  radiusX={shape.radiusX}
                  radiusY={shape.radiusY}
                  strokeWidth={2}
                  stroke={shape.color || "white"}
                  shadowColor="white"
                  shadowBlur={15}
                  shadowOpacity={0.9}
                  shadowOffsetX={
                    dragState.dragging && shape.id == dragState.id ? 6 : 0
                  }
                  shadowOffsetY={
                    dragState.dragging && shape.id == dragState.id ? 6 : 0
                  }
                  scaleX={
                    dragState.dragging && shape.id == dragState.id ? 1.05 : 1
                  }
                  scaleY={
                    dragState.dragging && shape.id == dragState.id ? 1.05 : 1
                  }
                  draggable
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                />
              );
            }
            if (shape.type === "line") {
              return (
                <Arrow
                  key={index}
                  id={shape.id}
                  points={shape.points}
                  stroke={shape.color || "white"}
                  strokeWidth={3}
                  tension={0.5}
                  lineCap="round"
                  pointerAtBeginning={false}
                  pointerAtEnding={false}
                  shadowColor="white"
                  shadowBlur={15}
                  shadowOpacity={0.9}
                  shadowOffsetX={
                    dragState.dragging && shape.id == dragState.id ? 6 : 0
                  }
                  shadowOffsetY={
                    dragState.dragging && shape.id == dragState.id ? 6 : 0
                  }
                  scaleX={
                    dragState.dragging && shape.id == dragState.id ? 1.05 : 1
                  }
                  scaleY={
                    dragState.dragging && shape.id == dragState.id ? 1.05 : 1
                  }
                  draggable
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                />
              );
            }
            return null;
          })}
          <Ellipse
            x={100} // X position of the center
            y={200} // Y position of the center
            radiusX={100} // Horizontal radius (half the width)
            radiusY={50} // Vertical radius (half the height)
            fill="green" // Ellipse color
            stroke="black" // Stroke color (border)
            strokeWidth={4} // Stroke width (border thickness)
            draggable={true} // Make the ellipse draggable
          />
        </Layer>
      </Stage>
    </div>
  );
};

export default App;

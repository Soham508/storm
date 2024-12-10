import { useEffect, useState } from "react";
import { Stage, Layer, Rect, Arrow, Ellipse, Circle } from "react-konva";
import { nanoid } from "nanoid";

const App = () => {
  const [shapes, setShapes] = useState([{}]);
  const [tool, setTool] = useState("rectangle"); // Tool selection: 'rectangle', 'circle', 'line', 'freehand'
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedShape, setSelectedShape] = useState(undefined);
  const [currentLine, setCurrentLine] = useState([]);
  const [dragState, setDragState] = useState({
    dragging: false,
    id: undefined,
  });
  const [startPosition, setStartPosition] = useState(undefined);

  useEffect(() => {
    console.log(selectedShape);

    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "f") {
        e.preventDefault();
        setTool("freehand");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedShape]);

  const handleStageClick = () => {
    if (tool === "freehand") {
      setSelectedShape(null);
    }
  };

  const handleShapeClick = (e, shape) => {
    if (tool === "freehand") {
      e.cancelBubble = true; // Prevent event from propagating to the Stage
      setSelectedShape(shape);
    }
  };

  const handleDragStart = (e) => {
    const id = e.target.id();
    setDragState({ dragging: true, id: id });
  };

  const handleDragEnd = (e) => {
    const id = e.target.id();
    const { x, y } = e.target.position();

    if (e.target.name() === "line") {
      const points = e.target.points();
      console.log(points);
      setShapes((prev) =>
        prev.map((shape) => (shape.id === id ? { ...shape, points } : shape))
      );
    } else {
      setShapes((prev) =>
        prev.map((shape) => (shape.id === id ? { ...shape, x, y } : shape))
      );
    }
    const shape = shapes.filter((shape) => shape.id == id);
    setSelectedShape(shape);
    setDragState({ dragging: false, id: undefined });
  };

  const handleMouseEnter = () => {
    if (tool === "freehand") {
      document.body.style.cursor = "pointer";
    }
  };

  const handleMouseLeave = () => {
    if (tool === "freehand") {
      document.body.style.cursor = "default";
    }
  };

  const handleMouseDown = (e) => {
    const { x, y } = e.target.getStage().getPointerPosition();

    switch (tool) {
      case "drawing":
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
      case "drawing":
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
      case "drawing":
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

  const renderSelectionBox = () => {
    if (!selectedShape) return null;

    const { x, y, width, height, type, points, radiusX, radiusY } =
      selectedShape;

    if (type === "rectangle") {
      const marginx = 5;
      const marginy = 5;
      return (
        <>
          {/* Dashed Selection Box */}
          <Rect
            x={x - marginx}
            y={y - marginy}
            width={width + marginx * 2}
            height={height + marginy * 2}
            stroke="red"
            strokeWidth={1}
            dash={[5, 5]}
          />
          {/* Resize Handles (Red Dots at Corners) */}
          <Circle
            x={x}
            y={y}
            radius={7}
            onDragMove={(e) => {
              const { x: newX, y: newY } = e.target.position();
              const {
                id,
                x: currentX,
                y: currentY,
                width: currentWidth,
                height: currentHeight,
              } = selectedShape;

              const updatedX = Math.min(currentX + currentWidth, newX);
              const updatedY = Math.min(currentY + currentHeight, newY);
              const updatedWidth = Math.abs(newX - (currentX + currentWidth));
              const updatedHeight = Math.abs(newY - (currentY + currentHeight));

              setShapes((prev) =>
                prev.map((shape) =>
                  shape.id === id
                    ? {
                        ...shape,
                        x: updatedX,
                        y: updatedY,
                        width: updatedWidth,
                        height: updatedHeight,
                      }
                    : shape
                )
              );
              setSelectedShape((prev) => ({
                ...prev,
                x: updatedX,
                y: updatedY,
                width: updatedWidth,
                height: updatedHeight,
              }));
            }}
            fill="red"
            draggable
          />

          <Circle
            x={x + width}
            y={y}
            radius={7}
            onDragMove={(e) => {
              const { x: newX, y: newY } = e.target.position();
              const {
                id,
                x: currentX,
                y: currentY,
                height: currentHeight,
              } = selectedShape;

              const updatedX = currentX;
              const updatedY = Math.min(currentY + currentHeight, newY);
              const updatedWidth = Math.abs(newX - currentX);
              const updatedHeight = Math.abs(newY - (currentY + currentHeight));

              setShapes((prev) =>
                prev.map((shape) =>
                  shape.id === id
                    ? {
                        ...shape,
                        x: updatedX,
                        y: updatedY,
                        width: updatedWidth,
                        height: updatedHeight,
                      }
                    : shape
                )
              );
              setSelectedShape((prev) => ({
                ...prev,
                x: updatedX,
                y: updatedY,
                width: updatedWidth,
                height: updatedHeight,
              }));
            }}
            fill="red"
            draggable
          />

          <Circle
            x={x}
            y={y + height}
            radius={7}
            onDragMove={(e) => {
              const { x: newX, y: newY } = e.target.position();
              const {
                id,
                x: currentX,
                y: currentY,
                width: currentWidth,
              } = selectedShape;

              const updatedX = Math.min(currentX + currentWidth, newX);
              const updatedY = currentY;
              const updatedWidth = Math.abs(newX - (currentX + currentWidth));
              const updatedHeight = Math.abs(newY - currentY);

              setShapes((prev) =>
                prev.map((shape) =>
                  shape.id === id
                    ? {
                        ...shape,
                        x: updatedX,
                        y: updatedY,
                        width: updatedWidth,
                        height: updatedHeight,
                      }
                    : shape
                )
              );
              setSelectedShape((prev) => ({
                ...prev,
                x: updatedX,
                y: updatedY,
                width: updatedWidth,
                height: updatedHeight,
              }));
            }}
            fill="red"
            draggable
          />

          <Circle
            x={x + width}
            y={y + height}
            radius={7}
            onDragMove={(e) => {
              const { x, y } = e.target.position();
              const { id, x: X, y: Y } = selectedShape;
              setShapes((prev) =>
                prev.map((shape) =>
                  shape.id === id
                    ? {
                        ...shape,
                        width: Math.abs(x - X),
                        height: Math.abs(y - Y),
                      }
                    : shape
                )
              );
              setSelectedShape((prev) => ({
                ...prev,
                width: Math.abs(x - X),
                height: Math.abs(y - Y),
              }));
            }}
            fill="red"
            draggable
          />
        </>
      );
    }

    if (type === "ellipse") {
      const marginx = 2;
      const marginy = 2;

      return (
        <>
          {/* Dashed Selection Box */}
          <Rect
            x={x - radiusX - marginx}
            y={y - radiusY - marginy}
            width={radiusX * 2 + marginx * 2}
            height={radiusY * 2 + marginy * 2}
            stroke="red"
            strokeWidth={1}
            dash={[5, 5]}
          />
          {/* Resize Handles (Red Dots at Corners) */}
          <Circle
            x={x - radiusX - marginx}
            y={y - radiusY - marginy}
            radius={6}
            onDragMove={(e) => {
              const { x, y } = e.target.position();
              const { id, x: centerX, y: centerY } = selectedShape;
              setShapes((prev) =>
                prev.map((shape) =>
                  shape.id === id
                    ? {
                        ...shape,
                        radiusX: Math.abs(x - centerX),
                        radiusY: Math.abs(y - centerY),
                      }
                    : shape
                )
              );
              setSelectedShape((prev) => ({
                ...prev,
                radiusX: Math.abs(x - centerX),
                radiusY: Math.abs(y - centerY),
              }));
            }}
            fill="red"
            draggable
          />
          <Circle
            x={x + radiusX + marginx}
            y={y - radiusY - marginy}
            radius={6}
            onDragMove={(e) => {
              const { x, y } = e.target.position();
              const { id, x: centerX, y: centerY } = selectedShape;
              setShapes((prev) =>
                prev.map((shape) =>
                  shape.id === id
                    ? {
                        ...shape,
                        radiusX: Math.abs(x - centerX),
                        radiusY: Math.abs(y - centerY),
                      }
                    : shape
                )
              );
              setSelectedShape((prev) => ({
                ...prev,
                radiusX: Math.abs(x - centerX),
                radiusY: Math.abs(y - centerY),
              }));
            }}
            fill="red"
            draggable
          />
          <Circle
            x={x - radiusX - marginx}
            y={y + radiusY + marginy}
            radius={6}
            onDragMove={(e) => {
              const { x, y } = e.target.position();
              const { id, x: centerX, y: centerY } = selectedShape;
              setShapes((prev) =>
                prev.map((shape) =>
                  shape.id === id
                    ? {
                        ...shape,
                        radiusX: Math.abs(x - centerX),
                        radiusY: Math.abs(y - centerY),
                      }
                    : shape
                )
              );
              setSelectedShape((prev) => ({
                ...prev,
                radiusX: Math.abs(x - centerX),
                radiusY: Math.abs(y - centerY),
              }));
            }}
            fill="red"
            draggable
          />
          <Circle
            x={x + radiusX + marginx}
            y={y + radiusY + marginy}
            radius={6}
            onDragMove={(e) => {
              const { x, y } = e.target.position();
              const { id, x: centerX, y: centerY } = selectedShape;
              setShapes((prev) =>
                prev.map((shape) =>
                  shape.id === id
                    ? {
                        ...shape,
                        radiusX: Math.abs(x - centerX),
                        radiusY: Math.abs(y - centerY),
                      }
                    : shape
                )
              );
              setSelectedShape((prev) => ({
                ...prev,
                radiusX: Math.abs(x - centerX),
                radiusY: Math.abs(y - centerY),
              }));
            }}
            fill="red"
            draggable
          />
        </>
      );
    }

    if (type === "line") {
      const [x1, y1, x2, y2] = points;

      return (
        <>
          {/* Dashed Selection Box */}
          <Rect
            x={Math.min(x1, x2) - 10}
            y={Math.min(y1, y2) - 10}
            width={Math.abs(x2 - x1) + 20}
            height={Math.abs(y2 - y1) + 20}
            stroke="black"
            strokeWidth={1}
            dash={[5, 5]}
          />
          {/* End Handles (Red Dots) */}
          <Circle x={x1} y={y1} radius={5} fill="red" draggable />
          <Circle x={x2} y={y2} radius={5} fill="red" draggable />
        </>
      );
    }

    return null;
  };

  return (
    <div>
      <div>
        <button onClick={() => setTool("rectangle")}>Rectangle</button>
        <button onClick={() => setTool("ellipse")}>Ellipse</button>
        <button onClick={() => setTool("line")}>Line</button>
        <button onClick={() => setTool("drawing")}>Draw</button>
        <button onClick={() => setTool("freehand")}>Free</button>
      </div>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleStageClick}
      >
        <Layer>
          {shapes.map((shape, index) => {
            if (shape.type === "rectangle") {
              return (
                <Rect
                  key={index}
                  id={shape.id}
                  name="rectangle"
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
                  draggable={tool === "freehand"}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={(e) => {
                    handleShapeClick(e, shape);
                  }}
                />
              );
            }
            if (shape.type === "ellipse") {
              return (
                <Ellipse
                  key={index}
                  id={shape.id}
                  name="ellipse"
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
                  draggable={tool === "freehand"}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={(e) => {
                    handleShapeClick(e, shape);
                  }}
                />
              );
            }
            if (shape.type === "line") {
              return (
                <Arrow
                  key={index}
                  id={shape.id}
                  name="line"
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
                  draggable={tool === "freehand"}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={(e) => {
                    console.log(e.target.attrs.points);
                    handleShapeClick(e, shape);
                  }}
                />
              );
            }
            return null;
          })}

          {renderSelectionBox()}
          <Rect x={0} y={0} height={100} width={100} stroke="red" />
        </Layer>
      </Stage>
    </div>
  );
};

export default App;

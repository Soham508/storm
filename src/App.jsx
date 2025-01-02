import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Rect, Arrow, Ellipse, Circle } from "react-konva";
import { nanoid } from "nanoid";
import { LiaHandPaperSolid } from "react-icons/lia";
import { LuPenLine } from "react-icons/lu";
import { TfiLayoutLineSolid } from "react-icons/tfi";
import { HiOutlineArrowLongRight } from "react-icons/hi2";
import { MdOutlineCircle, MdOutlineRedo } from "react-icons/md";
import { BiRectangle } from "react-icons/bi";
import { CiText } from "react-icons/ci";
import { MdOutlineUndo } from "react-icons/md";
import { FiZoomIn, FiZoomOut } from "react-icons/fi";

const App = () => {
  const [shapes, setShapes] = useState([{}]);
  const [shapesBin, setShapesBin] = useState([{}]);
  const stageRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [tool, setTool] = useState({
    type: "rectangle",
    properties: { color: "white" },
  });
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedShape, setSelectedShape] = useState(undefined);
  const [currentLine, setCurrentLine] = useState([]);
  const [dragState, setDragState] = useState({
    dragging: false,
    id: undefined,
  });
  const [startPosition, setStartPosition] = useState(undefined);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "f") {
        e.preventDefault();
        setTool({ type: "freehand" });
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    console.log(selectedShape);
    console.log(shapes);
  }, [shapes, selectedShape]);

  useEffect(() => {
    if (tool.type === "freehand") {
      document.body.style.cursor = "grab";
    } else {
      document.body.style.cursor = "default";
      setSelectedShape(undefined);
    }
    return () => {
      document.body.style.cursor = "default";
    };
  }, [tool]);

  const handleStageClick = (e) => {
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();
    //const pointerPosition = stage.getRelativePointerPosition();

    switch (tool.type) {
      case "freehand":
        setSelectedShape(null);

        break;

      case "textbox":
        setShapes([
          ...shapes,
          {
            id: nanoid(),
            type: "textbox",
            x: pointerPosition.x,
            y: pointerPosition.y,
            horizontalShift: 0,
            verticalShift: 0,
            fontFamily: "Arial",
            fontSize: 20,
            ...tool.properties,
            text: "",
          },
        ]);
        break;

      default:
        break;
    }
  };

  const handleShapeClick = (e, shape) => {
    if (tool.type === "freehand") {
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
    if (tool.type === "freehand") {
      document.body.style.cursor = "pointer";
    }
  };

  const handleMouseLeave = () => {
    if (tool.type === "freehand") {
      document.body.style.cursor = "grab";
    }
  };

  const handleMouseDown = (e) => {
    const { x, y } = e.target.getStage().getRelativePointerPosition();

    switch (tool.type) {
      case "freehand":
        document.body.style.cursor = "grabbing";

        break;

      case "drawing":
        setIsDrawing(true);
        setCurrentLine([x, y]);
        break;

      case "line":
        setCurrentLine([x, y]);
        break;

      case "arrow":
        setCurrentLine([x, y]);
        break;

      default:
        setStartPosition({ startX: x, startY: y });
        break;
    }
  };

  const handleMouseMove = (e) => {
    const { x, y } = e.target.getStage().getRelativePointerPosition();

    switch (tool.type) {
      case "drawing":
        if (isDrawing) {
          setCurrentLine((prevLine) => [...prevLine, x, y]);

          if (
            shapes[shapes.length - 1]?.type === "line" &&
            shapes[shapes.length - 1]?.MouseMove
          ) {
            setShapes((prevShapes) => [
              ...prevShapes.slice(0, prevShapes.length - 1),
              {
                type: "line",
                points: currentLine,
                MouseMove: true,
                ...tool.properties,
              },
            ]);
          } else {
            setShapes((prevShapes) => [
              ...prevShapes,
              {
                type: "line",
                points: currentLine,
                MouseMove: true,
                ...tool.properties,
              },
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
                  ...tool.properties,
                  MouseMove: true,
                },
              ];
            } else {
              return [
                ...prevShapes,
                {
                  type: "line",
                  points: [...currentLine],
                  ...tool.properties,
                  MouseMove: true,
                },
              ];
            }
          });
        }
        break;

      case "arrow":
        if (currentLine.length >= 2) {
          setCurrentLine((prevLine) => [...prevLine.slice(0, 2), x, y]);

          // Update the last line shape in the shapes array
          setShapes((prevShapes) => {
            if (
              prevShapes[prevShapes.length - 1]?.MouseMove &&
              prevShapes[prevShapes.length - 1]?.type === "arrow"
            ) {
              return [
                ...prevShapes.slice(0, prevShapes.length - 1),
                {
                  type: "arrow",
                  points: [...currentLine, x, y],
                  ...tool.properties,
                  MouseMove: true,
                },
              ];
            } else {
              return [
                ...prevShapes,
                {
                  type: "arrow",
                  points: [...currentLine],
                  ...tool.properties,
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
                  ...tool.properties,
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
                  ...tool.properties,
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
                  ...tool.properties,
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
                  ...tool.properties,
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
    const { x, y } = e.target.getStage().getRelativePointerPosition();

    // In order to avoid conflict of onClick and MouseDown+MouseUp, use MouseMove property defined during mousemove
    switch (tool.type) {
      case "freehand":
        document.body.style.cursor = "grab";
        break;

      case "drawing":
        if (isDrawing) {
          if (shapes[shapes.length - 1].MouseMove) {
            setShapes((prevShapes) => [
              ...prevShapes.slice(0, prevShapes.length - 1),
              {
                id: nanoid(),
                type: "line",
                points: currentLine,
                ...tool.properties,
              },
            ]);
          }
          setCurrentLine([]);
          setIsDrawing(false);
        }
        break;

      case "line":
        if (shapes[shapes.length - 1].MouseMove) {
          setShapes((prevShapes) => [
            ...prevShapes.slice(0, prevShapes.length - 1),
            {
              id: nanoid(),
              type: "line",
              points: [...currentLine.slice(0, 2), x, y],
              ...tool.properties,
            },
          ]);
        }

        setCurrentLine([]);
        break;

      case "arrow":
        if (shapes[shapes.length - 1].MouseMove) {
          setShapes((prevShapes) => [
            ...prevShapes.slice(0, prevShapes.length - 1),
            {
              id: nanoid(),
              type: "arrow",
              points: [...currentLine.slice(0, 2), x, y],
              ...tool.properties,
            },
          ]);
        }
        setCurrentLine([]);
        break;

      case "ellipse":
        if (startPosition) {
          const radiusX = Math.abs(startPosition.startX - x) / 2;
          const radiusY = Math.abs(startPosition.startY - y) / 2;

          if (shapes[shapes.length - 1].MouseMove) {
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
                ...tool.properties,
              },
            ]);
          }
          setStartPosition(undefined);
        }
        break;

      case "rectangle":
        if (shapes[shapes.length - 1].MouseMove) {
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
                ...tool.properties,
              },
            ];
          });
        }
        setStartPosition(undefined);
        break;

      default:
        break;
    }
  };

  const handleTextChange = (id, newText) => {
    setShapes((prevShapes) =>
      prevShapes.map((shape) =>
        shape.id === id ? { ...shape, text: newText } : shape
      )
    );
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

  const handleUndo = () => {
    if (shapes.length > 0) {
      const undoShape = shapes[shapes.length - 1];
      setShapes((prevShapes) => prevShapes.slice(0, prevShapes.length - 1)); // Remove the last shape
      setShapesBin((prevShapesBin) => [...prevShapesBin, undoShape]); // Add the last shape to the undo bin
    } else {
      window.alert("Nothing to undo");
    }
  };

  const handleRedo = () => {
    if (shapesBin.length > 0) {
      const redoShape = shapesBin[shapesBin.length - 1];
      setShapes((prevShapes) => [...prevShapes, redoShape]); // Add the shape back to the shapes array
      setShapesBin((prevShapesBin) =>
        prevShapesBin.slice(0, prevShapesBin.length - 1)
      ); // Remove the last undone shape from the bin
    } else {
      window.alert("Nothing to redo");
    }
  };

  return (
    <>
      <div className="w-full flex items-center bg-black/50 overflow-hidden">
        <div className="flex flex-col w-16 items-center rounded-lg bg-[#232329] gap-2 pt-2 pb-2 z-50 sticky top-4 left-3">
          <button
            className={`bg-transparent flex items-center hover:bg-zinc-900  ${
              tool.type == "freehand"
                ? "bg-zinc-700  border-1 border-zinc-400"
                : ""
            } cursor-pointer h-12 w-14 `}
            onClick={() => {
              setTool({ type: "freehand" });
            }}
          >
            <LiaHandPaperSolid size={24} />
          </button>
          <button
            className={`bg-transparent flex items-center hover:bg-zinc-900 ${
              tool.type == "rectangle"
                ? "bg-zinc-700 border-1 border-zinc-400 "
                : ""
            } cursor-pointer h-12 w-14 `}
            onClick={() =>
              setTool({ type: "rectangle", properties: { color: "red" } })
            }
          >
            <BiRectangle size={24} />
          </button>
          <button
            className={`bg-transparent flex items-center hover:bg-zinc-900  ${
              tool.type == "ellipse"
                ? "bg-zinc-700 border-1 border-zinc-400 "
                : ""
            } cursor-pointer h-12 w-14 `}
            onClick={() =>
              setTool({ type: "ellipse", properties: { color: "red" } })
            }
          >
            <MdOutlineCircle size={24} />
          </button>
          <button
            className={`bg-transparent flex items-center hover:bg-zinc-9 00 ${
              tool.type == "arrow"
                ? "bg-zinc-700 border-1 border-zinc-400 "
                : ""
            } cursor-pointer h-12 w-14 `}
            onClick={() =>
              setTool({ type: "arrow", properties: { color: "white" } })
            }
          >
            <HiOutlineArrowLongRight size={24} />
          </button>
          <button
            className={`bg-transparent flex items-center hover:bg-zinc- 900 ${
              tool.type == "line" ? "bg-zinc-700 border-1 border-zinc-400 " : ""
            } cursor-pointer h-12 w-14 `}
            onClick={() =>
              setTool({ type: "line", properties: { color: "white" } })
            }
          >
            <TfiLayoutLineSolid size={24} />
          </button>
          <button
            className={`bg-transparent flex items-center hover:bg-zinc-900  ${
              tool.type == "textbox"
                ? "bg-zinc-700 border-1 border-zinc-400 "
                : ""
            } cursor-pointer h-12 w-14 `}
            onClick={() =>
              setTool({ type: "textbox", properties: { color: "white" } })
            }
          >
            <CiText size={24} />
          </button>
          <button
            className={`bg-transparent flex items-center hover:bg-zinc-900  ${
              tool.type == "drawing"
                ? "bg-zinc-700 border-1 border-zinc-400 "
                : ""
            } cursor-pointer h-12 w-14 `}
            onClick={() =>
              setTool({ type: "drawing", properties: { color: "white" } })
            }
          >
            <LuPenLine size={24} />
          </button>
        </div>

        <div className="absolute left-[50%] gap-0 flex cursor-pointer top-4 z-50">
          <button onClick={handleUndo} className="rounded-r-[0]">
            <MdOutlineUndo />
          </button>
          <button onClick={handleRedo} className="rounded-l-[0]">
            <MdOutlineRedo />
          </button>
        </div>
        <div className="absolute h-10 left-[50%] gap-0 flex cursor-pointer bottom-4 z-50">
          <button
            onClick={() => setScale((prev) => prev + 0.05)}
            className="rounded-r-[0]"
          >
            <FiZoomIn />
          </button>
          <div className="h-full w-16 text-center flex items-center justify-center bg-[#242424]">
            {(scale * 100).toFixed(0)}%
          </div>
          <button
            onClick={() => setScale((prev) => prev - 0.05)}
            className="rounded-l-[0]"
          >
            <FiZoomOut />
          </button>
        </div>

        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          ref={stageRef}
          scaleX={scale}
          scaleY={scale}
          onClick={handleStageClick}
          draggable={tool.type == "freehand"}
          onDragMove={(e) => {
            const stage = e.target.getStage();
            const pointerPosition = stage.getPointerPosition();
            const pointerRelativePosition = stage.getRelativePointerPosition();
            console.log(pointerPosition);
            console.log(pointerRelativePosition);
            const verticalShift = pointerPosition.y - pointerRelativePosition.y;
            const horizontalShift =
              pointerPosition.x - pointerRelativePosition.x;
            setShapes((prevShapes) =>
              prevShapes.map((shape) =>
                shape.type === "textbox"
                  ? {
                      ...shape,
                      horizontalShift:
                        shape.horizontalShift - pointerRelativePosition.x,
                      verticalShift:
                        shape.verticalShift - pointerRelativePosition.y,
                    }
                  : shape
              )
            );
          }}
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
                    draggable={tool.type === "freehand"}
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
                    draggable={tool.type === "freehand"}
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
                    draggable={tool.type === "freehand"}
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

              if (shape.type === "arrow") {
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
                    pointerAtEnding={true}
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
                    draggable={tool.type === "freehand"}
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
          </Layer>
        </Stage>
        {shapes.map((shape) => {
          if (shape.type === "textbox") {
            return (
              <div
                key={shape.id}
                className="absolute"
                style={{
                  left: `${shape.x + shape.horizontalShift}px`,
                  top: `${shape.y + shape.verticalShift}px`,
                  fontFamily: shape.fontFamily,
                  fontSize: `${shape.fontSize}px`,
                  color: shape.color,
                  width: "200px",
                  height: "40px",
                }}
              >
                <textarea
                  placeholder="Type..."
                  className="w-full h-full bg-transparent border-none resize"
                  value={shape.text}
                  onChange={(e) => handleTextChange(shape.id, e.target.value)}
                  autoFocus
                />
              </div>
            );
          }
          return null;
        })}
      </div>
    </>
  );
};

export default App;

/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Rect, Arrow, Ellipse, Circle, Text } from "react-konva";
import { nanoid } from "nanoid";
import { LiaHandPaperSolid } from "react-icons/lia";
import { LuPenLine } from "react-icons/lu";
import { TfiLayoutLineSolid } from "react-icons/tfi";
import { HiOutlineArrowLongRight } from "react-icons/hi2";
import { TbArrowCurveLeft } from "react-icons/tb";
import { MdOutlineCircle, MdOutlineRedo } from "react-icons/md";
import { BiRectangle } from "react-icons/bi";
import { CiText } from "react-icons/ci";
import { MdOutlineUndo } from "react-icons/md";
import { FiZoomIn, FiZoomOut } from "react-icons/fi";
import { FiMenu } from "react-icons/fi";
import Menubar from "./components/Menubar";

const App = () => {
  const [shapes, setShapes] = useState([{}]);
  const [shapesBin, setShapesBin] = useState([{}]);
  const stageRef = useRef(null);
  const layerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [tool, setTool] = useState({
    type: "rectangle",
    properties: { color: "white" },
  });
  const [menu, setMenu] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedShape, setSelectedShape] = useState(undefined);
  const [currentLine, setCurrentLine] = useState([]);
  const [tempData, setTempData] = useState({});
  const [dragState, setDragState] = useState({
    dragging: false,
    id: undefined,
  });
  const [startPosition, setStartPosition] = useState(undefined);

  useEffect(() => {
    window.addEventListener("keydown", handleToolKeyDown);

    return () => {
      window.removeEventListener("keydown", handleToolKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedShape && selectedShape.type === "textbox") {
      window.addEventListener("keydown", handleKeyDownText);
    } else if (selectedShape) {
      window.addEventListener("keydown", handleKeyDownShape);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDownText);
      window.removeEventListener("keydown", handleKeyDownShape);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedShape]);

  useEffect(() => {
    setTempData({});
    setCurrentLine([]);
    setSelectedShape(null);
    if (tool.type === "freehand") {
      document.body.style.cursor = "grab";
    } else {
      document.body.style.cursor = "default";
    }
    return () => {
      document.body.style.cursor = "default";
    };
  }, [tool]);

  const handleToolKeyDown = (e) => {
    if (e.ctrlKey && e.key === "f") {
      e.preventDefault();
      setTool({ type: "freehand" });
    } else if (e.ctrlKey && e.key === "z") {
      e.preventDefault();
      handleUndo();
    } else if (e.ctrlKey && e.key === "x") {
      e.preventDefault();
      handleRedo();
    }
  };

  const handleKeyDownShape = (e) => {
    e.preventDefault();
    if (!selectedShape) return;

    if (e.ctrlKey && e.key === "c") {
      setShapes((prev) => [
        ...prev,
        {
          ...selectedShape,
          id: nanoid(),
          x: selectedShape.x + 15,
          y: selectedShape.y + 15,
        },
      ]);
    } else if (e.key === "Delete" || (e.ctrlKey && e.key === "d")) {
      setShapesBin((prevShapesBin) => [...prevShapesBin, { ...selectedShape }]);
      setShapes((prevShapes) =>
        prevShapes.filter((shape) => shape.id != selectedShape.id)
      );
      setSelectedShape(null);
    }
  };
  const handleKeyDownText = (e) => {
    if (!selectedShape) return;

    const key = e.key;
    if (key === "Backspace") {
      setShapes((prevShapes) =>
        prevShapes.map((shape) => {
          if (shape.id === selectedShape.id) {
            return {
              ...shape,
              text: shape.text.slice(0, -1),
            };
          }
          return shape;
        })
      );
    } else if (key === "Enter") {
      setShapes((prevShapes) =>
        prevShapes.map((shape) => {
          if (shape.id === selectedShape.id) {
            return {
              ...shape,
              text: shape.text + "\n",
            };
          }
          return shape;
        })
      );
    } else if (e.shiftKey) {
      // Check if the key pressed is a letter (a-z or A-Z)
      if (
        e.key.length === 1 &&
        /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};`~':"\\|,.<>/? ]$/.test(e.key)
      ) {
        setShapes((prevShapes) =>
          prevShapes.map((shape) => {
            if (shape.id === selectedShape.id) {
              console.log(shape.text);
              return { ...shape, text: shape.text + e.key.toUpperCase() };
            }
            return shape;
          })
        );
      }
    } else if (
      e.key.length === 1 &&
      /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};`~':"\\|,.<>/? ]$/.test(e.key)
    ) {
      setShapes((prevShapes) =>
        prevShapes.map((shape) => {
          if (shape.id === selectedShape.id) {
            console.log(shape.text);
            return { ...shape, text: shape.text + key };
          }
          return shape;
        })
      );
    }
  };

  const handleStageClick = (e) => {
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();
    const RelativePointerPosition = stage.getRelativePointerPosition();

    switch (tool.type) {
      case "freehand":
        setSelectedShape(null);
        break;

      case "curve":
        setCurrentLine((prev) => [
          ...prev,
          RelativePointerPosition.x,
          RelativePointerPosition.y,
        ]);
        setTempData((prev) => ({
          ...prev,
          curvePoints: prev.curvePoints ? prev.curvePoints + 1 : 1,
        }));

        break;

      case "textbox":
        setShapes(() => {
          const newShape = {
            id: nanoid(),
            type: "textbox",
            x: RelativePointerPosition.x,
            y: RelativePointerPosition.y,
            horizontalShift: 0,
            verticalShift: 0,
            fontFamily: "Arial",
            fontSize: 24,
            ...tool.properties,
            text: "Type",
          };
          setSelectedShape(newShape);
          return [...shapes, newShape];
        });
        break;

      default:
        break;
    }
  };

  const handleShapeClick = (e, shape) => {
    console.log(shape);
    if (tool.type === "freehand") {
      e.cancelBubble = true; // Prevent event from propagating to the Stage
      if (selectedShape && selectedShape.id === shape.id) {
        setSelectedShape(null);
        return;
      }
      setSelectedShape(shape);
    }
  };

  const handleDragStart = (e) => {
    e.cancelBubble = true;
    if (tool.type === "freehand") {
      document.body.style.cursor = "move";
    }
    const id = e.target.id();
    setDragState({ dragging: true, id: id });
  };

  const handleDragMove = () => {
    if (tool.type === "freehand") {
      document.body.style.cursor = "move";
    }
  };

  const handleDragEnd = (e) => {
    if (tool.type === "freehand") {
      document.body.style.cursor = "move";
    }

    const id = e.target.id();
    const { x, y } = e.target.position();

    if (e.target.name() === "line" || e.target.name() === "arrow") {
      const [x1, y1, x2, y2] = e.target.points();
      const xDiff = e.target.x();
      const yDiff = e.target.y();
      //console.log(x1 + xDiff, y1 + yDiff, x2 + xDiff, y2 + yDiff);
      setShapes((prev) =>
        prev.map((shape) =>
          shape.id === id
            ? {
                ...shape,
                points: e.target.points(),
                newPoints: [x1 + xDiff, y1 + yDiff, x2 + xDiff, y2 + yDiff],
                xDiff,
                yDiff,
              }
            : shape
        )
      );
    } else {
      setShapes((prev) =>
        prev.map((shape) => (shape.id === id ? { ...shape, x, y } : shape))
      );
    }
    const shape = shapes.filter((shape) => shape.id == id);
    setSelectedShape(shape);
    setDragState({ dragging: false, id: null });
  };

  const handleMouseEnter = (e) => {
    if (tool.type === "freehand") {
      document.body.style.cursor = "move";
      e.cancelBubble = true;
    }
  };

  const handleMouseLeave = () => {
    if (tool.type === "freehand") {
      document.body.style.cursor = "grab";
    }
  };

  //------------------- Create shapes-----------------//

  const handleMouseDown = (e) => {
    const { x, y } = e.target.getStage().getRelativePointerPosition();

    switch (tool.type) {
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

      //case "curve":
      //  if (currentLine.length === 0) {
      //    setCurrentLine([x, y]);
      //    setTempData({ curvePoints: 1 });
      //  }
      //  break;

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

      case "curve":
        if (currentLine.length >= 2) {
          setCurrentLine((prevLine) => [
            ...prevLine.slice(0, 2 * tempData.curvePoints),
            x,
            y,
          ]);

          setShapes((prevShapes) => {
            if (
              prevShapes[prevShapes.length - 1]?.MouseMove &&
              prevShapes[prevShapes.length - 1]?.type === "curve"
            ) {
              return [
                ...prevShapes.slice(0, prevShapes.length - 1),
                {
                  type: "curve",
                  points: [...currentLine, x, y],
                  ...tool.properties,
                  MouseMove: true,
                },
              ];
            } else {
              return [
                ...prevShapes,
                {
                  type: "curve",
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

  const handleDblClick = (e) => {
    const { x, y } = e.target.getStage().getRelativePointerPosition();

    switch (tool.type) {
      case "curve":
        if (shapes[shapes.length - 1].MouseMove) {
          setShapes((prevShapes) => [
            ...prevShapes.slice(0, prevShapes.length - 1),
            {
              id: nanoid(),
              type: "curve",
              points: [...currentLine, x, y],
              ...tool.properties,
            },
          ]);
        }

        setCurrentLine([]);
        setTempData((prev) => ({ ...prev, curvePoints: 0 }));
        break;

      default:
        break;
    }
  };

  //---------------------------------------------------//

  //--------------Render selection shape---------------//
  const renderSelectionBox = () => {
    if (!selectedShape) return null;

    const { x, y, width, height, type, radiusX, radiusY, rotation } =
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
      const [x1, y1, x2, y2] = selectedShape.newPoints
        ? selectedShape.newPoints
        : selectedShape.points;

      return (
        <>
          {/* Dashed Selection Box */}
          <Rect
            x={Math.min(x1, x2) - 10}
            y={Math.min(y1, y2) - 10}
            width={Math.abs(x2 - x1) + 20}
            height={Math.abs(y2 - y1) + 20}
            stroke="red"
            strokeWidth={1}
            dash={[5, 5]}
          />
          {/* End Handles (Red Dots) */}
          <Circle
            x={x1}
            y={y1}
            radius={5}
            fill="red"
            draggable
            onDragMove={(e) => {
              console.log(stageRef);
              const xDiff = selectedShape.xDiff ? selectedShape.xDiff : 0;
              const yDiff = selectedShape.yDiff ? selectedShape.yDiff : 0;
              const [x1, y1, x2, y2] = selectedShape.newPoints
                ? selectedShape.newPoints
                : selectedShape.points;
              //console.log(
              //  e.target._lastPos,
              //  e.target.x(),
              //  e.target.y(),
              //  xDiff,
              //  yDiff
              //);
              setShapes((prev) =>
                prev.map((shape) =>
                  shape.id === selectedShape.id
                    ? {
                        ...shape,
                        points: [
                          e.target.x() - xDiff,
                          e.target.y() - yDiff,
                          shape.points[2],
                          shape.points[3],
                        ],
                        newPoints: [e.target.x(), e.target.y(), x2, y2],
                      }
                    : shape
                )
              );
              setSelectedShape((prev) => ({
                ...prev,
                points: [
                  e.target.x(),
                  e.target.y(),
                  prev.points[2],
                  prev.points[3],
                ],
                newPoints: [e.target.x(), e.target.y(), x2, y2],
              }));
            }}
          />
          <Circle
            x={x2}
            y={y2}
            radius={5}
            fill="red"
            draggable
            onDragMove={(e) => {
              const xDiff = selectedShape.xDiff ? selectedShape.xDiff : 0;
              const yDiff = selectedShape.yDiff ? selectedShape.yDiff : 0;
              const [x1, y1, x2, y2] = selectedShape.newPoints
                ? selectedShape.newPoints
                : selectedShape.points;
              //console.log(
              //  e.target._lastPos,
              //  e.target.x(),
              //  e.target.y(),
              //  xDiff,
              //  yDiff
              //);
              setShapes((prev) =>
                prev.map((shape) =>
                  shape.id === selectedShape.id
                    ? {
                        ...shape,
                        points: [
                          shape.points[0],
                          shape.points[1],
                          e.target.x() - xDiff,
                          e.target.y() - yDiff,
                        ],
                        newPoints: [x1, y1, e.target.x(), e.target.y()],
                      }
                    : shape
                )
              );
              setSelectedShape((prev) => ({
                ...prev,
                points: [
                  prev.points[0],
                  prev.points[1],
                  e.target.x() - xDiff,
                  e.target.y() - yDiff,
                ],
                newPoints: [x1, y1, e.target.x(), e.target.y()],
              }));
            }}
          />
        </>
      );
    }

    if (type === "arrow") {
      const [x1, y1, x2, y2] = selectedShape.newPoints
        ? selectedShape.newPoints
        : selectedShape.points;

      return (
        <>
          {/* Dashed Selection Box */}
          <Rect
            x={Math.min(x1, x2) - 10}
            y={Math.min(y1, y2) - 10}
            width={Math.abs(x2 - x1) + 20}
            height={Math.abs(y2 - y1) + 20}
            stroke="red"
            strokeWidth={1}
            dash={[5, 5]}
          />
          {/* End Handles (Red Dots) */}
          <Circle
            x={x1}
            y={y1}
            radius={5}
            fill="red"
            stroke="red"
            draggable
            onDragMove={(e) => {
              const xDiff = selectedShape.xDiff ? selectedShape.xDiff : 0;
              const yDiff = selectedShape.yDiff ? selectedShape.yDiff : 0;
              const [x1, y1, x2, y2] = selectedShape.newPoints
                ? selectedShape.newPoints
                : selectedShape.points;
              //console.log(
              //  e.target._lastPos,
              //  e.target.x(),
              //  e.target.y(),
              //  xDiff,
              //  yDiff
              //);
              setShapes((prev) =>
                prev.map((shape) =>
                  shape.id === selectedShape.id
                    ? {
                        ...shape,
                        points: [
                          e.target.x() - xDiff,
                          e.target.y() - yDiff,
                          shape.points[2],
                          shape.points[3],
                        ],
                        newPoints: [e.target.x(), e.target.y(), x2, y2],
                      }
                    : shape
                )
              );
              setSelectedShape((prev) => ({
                ...prev,
                points: [
                  e.target.x(),
                  e.target.y(),
                  prev.points[2],
                  prev.points[3],
                ],
                newPoints: [e.target.x(), e.target.y(), x2, y2],
              }));
            }}
          />
        </>
      );
    }

    return null;
  };
  //---------------------------------------------------//
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

  const handleStageDragStart = () => {
    if (tool.type === "freehand") {
      document.body.style.cursor = "grabbing";
    }
  };

  return (
    <>
      <div className="w-full flex items-center bg-black/50 overflow-hidden">
        <button
          className="absolute h-12 w-14 p-0 top-4 left-4 flex items-center justify-center cursor-pointer z-50"
          onClick={() => setMenu((prev) => !prev)}
        >
          <FiMenu size={20} />
        </button>

        {menu && (
          <>
            <Menubar stageRef={stageRef} />
          </>
        )}

        <div
          className="flex flex-col w-16 items-center rounded-lg bg-[#232329] gap-2 pt-2 pb-2 z-40 absolute top-50 left-3"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
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
            className={`bg-transparent flex items-center hover:bg-zinc-900 ${
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
            className={`bg-transparent flex items-center hover:bg-zinc-900 ${
              tool.type == "line" ? "bg-zinc-700 border-1 border-zinc-400 " : ""
            } cursor-pointer h-12 w-14 `}
            onClick={() =>
              setTool({ type: "line", properties: { color: "white" } })
            }
          >
            <TfiLayoutLineSolid size={24} />
          </button>
          <button
            className={`bg-transparent flex items-center hover:bg-zinc-900 ${
              tool.type == "curve"
                ? "bg-zinc-700 border-1 border-zinc-400 "
                : ""
            } cursor-pointer h-12 w-14 `}
            onClick={() =>
              setTool({ type: "curve", properties: { color: "white" } })
            }
          >
            <TbArrowCurveLeft size={24} />
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
          onDblClick={handleDblClick}
          onDragStart={handleStageDragStart}
          ref={stageRef}
          scaleX={scale}
          scaleY={scale}
          onClick={handleStageClick}
          draggable={tool.type == "freehand"}
        >
          <Layer ref={layerRef}>
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
                      dragState.dragging && shape.id == dragState.id ? 1.02 : 1
                    }
                    scaleY={
                      dragState.dragging && shape.id == dragState.id ? 1.02 : 1
                    }
                    draggable={tool.type === "freehand"}
                    onDragStart={handleDragStart}
                    onDragMove={handleDragMove}
                    onDragEnd={handleDragEnd}
                    onMouseEnter={(e) => {
                      handleMouseEnter(e);
                    }}
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
                      dragState.dragging && shape.id == dragState.id ? 1.02 : 1
                    }
                    scaleY={
                      dragState.dragging && shape.id == dragState.id ? 1.02 : 1
                    }
                    draggable={tool.type === "freehand"}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onMouseEnter={(e) => {
                      handleMouseEnter(e);
                    }}
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
                    draggable={tool.type === "freehand"}
                    onDragStart={handleDragStart}
                    onDragMove={handleDragMove}
                    onDragEnd={handleDragEnd}
                    onMouseEnter={(e) => {
                      handleMouseEnter(e);
                    }}
                    onMouseLeave={handleMouseLeave}
                    onClick={(e) => {
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
                    name="arrow"
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
                    draggable={tool.type === "freehand"}
                    onDragStart={handleDragStart}
                    onDragMove={handleDragMove}
                    onDragEnd={handleDragEnd}
                    onMouseEnter={(e) => {
                      handleMouseEnter(e);
                    }}
                    onMouseLeave={handleMouseLeave}
                    onClick={(e) => {
                      handleShapeClick(e, shape);
                    }}
                  />
                );
              }

              if (shape.type === "curve") {
                return (
                  <Arrow
                    key={index}
                    id={shape.id}
                    name="curve"
                    points={shape.points}
                    stroke={shape.color || "white"}
                    strokeWidth={3}
                    tension={0.3}
                    closed={false}
                    lineCap="round"
                    lineJoin="round"
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
                    draggable={tool.type === "freehand"}
                    onDragStart={handleDragStart}
                    onDragMove={handleDragMove}
                    onDragEnd={handleDragEnd}
                    onMouseEnter={(e) => {
                      handleMouseEnter(e);
                    }}
                    onMouseLeave={handleMouseLeave}
                    onClick={(e) => {
                      handleShapeClick(e, shape);
                    }}
                  />
                );
              }

              return null;
            })}

            {renderSelectionBox()}
          </Layer>
          <Layer>
            {shapes.map((shape, index) => {
              if (shape.type === "textbox") {
                return (
                  <Text
                    key={index}
                    id={shape.id}
                    name="textbox"
                    text={
                      selectedShape && selectedShape.id === shape.id
                        ? shape.text + "|"
                        : shape.text
                    }
                    fill={shape.color || "white"}
                    fontSize={shape.fontSize}
                    x={shape.x}
                    y={shape.y}
                    offsetX={
                      selectedShape && selectedShape.id === shape.id ? 6 : 0
                    }
                    offsetY={
                      selectedShape && selectedShape.id === shape.id ? 6 : 0
                    }
                    onClick={(e) => {
                      handleShapeClick(e, shape);
                    }}
                    draggable={tool.type === "freehand"}
                    wrap="char"
                    ellipsis
                    onDblClick={() => {}}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onDragStart={handleDragStart}
                    onDragMove={handleDragMove}
                    onDragEnd={handleDragEnd}
                  />
                );
              }

              return null;
            })}
          </Layer>
        </Stage>
      </div>
    </>
  );
};

export default App;

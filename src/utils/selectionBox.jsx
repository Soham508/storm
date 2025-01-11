/* eslint-disable no-unused-vars */
import { Circle, Rect } from "react-konva";

const renderSelectionBox = ({
  selectedShape,
  setSelectedShape,
  setShapes,
  stageRef,
}) => {
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
            console.log(selectedShape);
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
    const [x1, y1, x2, y2] = selectedShape.points;

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
                        e.target.x(),
                        e.target.y(),
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
                        e.target.x(),
                        e.target.y(),
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
                e.target.x(),
                e.target.y(),
              ],
              newPoints: [x1, y1, e.target.x(), e.target.y()],
            }));
          }}
        />
      </>
    );
  }

  if (type === "arrow") {
    const [x1, y1, x2, y2] = selectedShape.points;

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
                        e.target.x(),
                        e.target.y(),
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

export default renderSelectionBox;

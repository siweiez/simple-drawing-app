import { SketchPicker } from 'react-color';
import { useEffect, useState, useRef } from 'react';
import Slider from 'rc-slider';
import { saveAs } from 'file-saver';
import 'rc-slider/assets/index.css';
import './styles/canvas.css';

function Canvas() {
  const [color, setColor] = useState("#4C4AE2");
  const [brushSize, setBrushSize] = useState(7);
  const [animate, setAnimate] = useState(false);

  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);

  const handleSetColor = (color) => {
    setAnimate(false);
    setColor(color.hex);
  };

  // const handleSetAnimate = () => {
  //   setAnimate(!animate);
  // };

  // const animation = () => {
  //   const canvas = canvasRef.current;
  //   const context = canvas.getContext('2d');
  //   contextRef.current = context;
  // }

  const handleSetBrushSize = (value) => {
    setBrushSize(value);
  };

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleDownload = () => {
    const canvas = document.getElementById('canvas');
    canvas.toBlob(function (blob) {
      saveAs(blob, "canvas.png");
    });
  }

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) {
      return;
    }
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.strokeStyle = color;
    context.lineWidth = brushSize;
    context.lineCap = "round";
    contextRef.current = context;
    // if (animate) {
    //   setInterval(animation, 30);
    // }
  }, [color, brushSize]);

  return (
    <div className='main'>
      <div className="left">
        <canvas
          id='canvas'
          width={600}
          height={600}
          onMouseDown={startDrawing}
          onMouseUp={finishDrawing}
          onMouseMove={draw}
          ref={canvasRef}
        />
        <div className="buttons">
          <button onClick={handleClearCanvas}>Clear canvas</button>
          <button onClick={handleDownload}>Download image</button>
        </div>
      </div>
      <div className='right'>
        <div className="welcome-text">Welcome to Simple Drawing</div>
        <SketchPicker
          className='sketch-picker'
          color={color}
          onChangeComplete={handleSetColor}
        />
        <div className="brush-size">
          <div className="brush-size-text">Brush Size: {brushSize}</div>
          <Slider
            className='slider'
            handleStyle={{
              height: 20,
              width: 20,
              marginLeft: 0,
              marginTop: -8,
              backgroundColor: "white",
              border: 0
            }}
            min={1}
            max={30}
            defaultValue={5}
            value={brushSize}
            onChange={handleSetBrushSize}
          />
          {/* <button className='animate' onClick={handleSetAnimate}>Make it alive!</button> */}
        </div>
      </div>
    </div>
  );
}

export default Canvas;
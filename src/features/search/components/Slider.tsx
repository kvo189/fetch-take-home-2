import { useRef, useState } from 'react';
import ReactSlider from 'react-slider';

interface SliderProps {
  min: number;
  max: number;
  value?: number;
  onChange: (value: number[]) => void;
  className?: string;
}

export const Slider = ({ min, max, onChange, className }: SliderProps) => {
  const [sliderValue, setSliderValue] = useState([min, max]); // initial min and max values
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value);
    onChange(value);
  };
  const renderTrack = (props: any, state: { index: number; value: number[] }): JSX.Element => {
    let trackStyle: React.CSSProperties = props.style;
    const trackRadius = '4px';
    if (typeof trackStyle.left === 'number' && typeof trackStyle.right === 'number') {
      // trackStyle = { ...trackStyle, left: trackStyle.left + 8, right: trackStyle.right + 4 };
    }
    if (state.index === 0) {
      trackStyle = { ...trackStyle, borderTopLeftRadius: trackRadius, borderBottomLeftRadius: trackRadius };
    }
    if (state.index === 1) {
      trackStyle = { ...trackStyle, backgroundColor: 'rgb(59, 130, 246)' };
    }
    if (state.index === 2) {
      trackStyle = { ...trackStyle, borderTopRightRadius: trackRadius, borderBottomRightRadius: trackRadius };
    }
    if (typeof trackStyle.left === 'number' && typeof trackStyle.right === 'number') {
      trackStyle = { ...trackStyle, left: trackStyle.left + 8, right: trackStyle.right + 8 };
    }
    return <div {...props} style={trackStyle} />;
  };
  const renderThumb = (props: any, _: { index: number; value: number[] }): JSX.Element => {
    let thumbStyle: React.CSSProperties = props.style;
    return <div {...props} style={thumbStyle} />;
  };
  const renderMark = (props: any): JSX.Element => {
    let style: React.CSSProperties = props.style;
    style = { ...style, transform: 'translateX(6px)' };
    return <div {...props} style={style} />;
  };
  return (
    <div className={`relative ${className}`} ref={sliderRef}>
      <div className='text-center w-full py-1 blue'>
        Age: {sliderValue[0]} - {sliderValue[1]}
      </div>
      <div className='py-1'>
        <ReactSlider
          className={`h-4 rounded-full z-20`}
          marks
          markClassName='h-4 w-1 bg-gray-200 rounded-full'
          trackClassName={`h-2 translate-y-1/2 bg-gray-200 inline-block z-10 track`}
          thumbClassName={`w-4 h-4 rounded-full cursor-grab !z-20 bg-white shadow-lg thumb`}
          renderTrack={renderTrack}
          renderThumb={renderThumb}
          renderMark={renderMark}
          value={sliderValue}
          onChange={(value) => handleSliderChange(value)}
          min={min}
          max={max}
          pearling={false}
          minDistance={1}
        />
      </div>
    </div>
  );
};
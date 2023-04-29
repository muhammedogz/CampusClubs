import { Slide, SlideProps, Stack } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

type SlidesProps = Omit<SlideProps, 'children'> & {
  index: number;
  children: React.ReactNode[];
};

const Slides = ({ children, index, ...rest }: SlidesProps) => {
  const containerRef = useRef(null);
  const [prevIndex, setPrevIndex] = useState(index);

  useEffect(() => {
    if (index !== prevIndex) {
      setPrevIndex(index);
    }
  }, [index]);

  return (
    <Stack
      ref={containerRef}
      sx={{
        overflow: 'hidden',
      }}
    >
      {children.map((child, i) => {
        if (i !== index) return null;

        return (
          <Slide
            in
            key={i}
            container={containerRef.current}
            direction={prevIndex < index ? 'left' : 'right'}
            mountOnEnter
            unmountOnExit
            {...rest}
          >
            <Stack>{child}</Stack>
          </Slide>
        );
      })}
    </Stack>
  );
};

export default Slides;

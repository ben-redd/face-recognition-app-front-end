import React from 'react';
import Tilt from 'react-tilt';
import './Logo.css';
import brain from './brain-image.png';

//adds an interactive logo using a library from https://www.npmjs.com/package/react-tilt
const Logo = () => {
  return (
    <div className="mh5 mv2">
      <Tilt className="Tilt br2 shadow-2" options={{ max: 40 }}>
        <div className="Tilt-inner pa3">
          <img src={brain} alt="brain logo" />
        </div>
      </Tilt>
    </div>
  );
};

export default Logo;

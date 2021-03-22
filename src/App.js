import React from 'react';
import Clarifai from 'clarifai';
import Particles from 'react-particles-js';
import SignIn from './components/SignIn/SignIn.component';
import Register from './components/Register/Register.component';
import Navigation from './components/Navigation/Navigation.component';
import Logo from './components/Logo/Logo.component';
import Rank from './components/Rank/Rank.component';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.component';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.component';
import './App.css';

//sets up the Clarifai API with my API key
const app = new Clarifai.App({
  apiKey: '5ba32d8a737c4dee81a73c846b8d8d22',
});

//parameters for the react-particles-js background component
const particleOptions = {
  particles: {
    number: {
      value: 50,
      density: {
        enable: true,
        value_area: 1200,
      },
    },
    line_linked: {
      enable: true,
      opacity: 0.3,
    },
    move: {
      random: true,
      speed: 1.5,
      out_mode: 'out',
    },
    size: {
      value: 1,
    },
  },
  retina_detect: true,
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
    };
  }

  //calculates the location of where the lines of the bounding box that will outline an image on a face should be
  calculateFaceLocation = (data) => {
    const boundingBox =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      leftCol: boundingBox.left_col * width,
      topRow: boundingBox.top_row * height,
      rightCol: width - boundingBox.right_col * width,
      bottomRow: height - boundingBox.bottom_row * height,
    };
  };

  //sets the state of box to be whatever was returned by calculateFaceLocation
  displayBoundingBox = (box) => {
    this.setState({ box: box });
  };

  //updates input state whenever it changes
  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  //when the Detect button is pressed the imageUrl state is updated so that the image is shown.
  //The image is then sent as a request to the Clarifai API and we can then receive a response
  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then((response) =>
        this.displayBoundingBox(this.calculateFaceLocation(response)),
      )
      .catch((err) => console.log(err));
  };

  //changes the state of route
  onRouteChange = (route) => {
    if (route === 'signin') {
      this.setState({ isSignedIn: false });
    } else if (route === 'home') {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  render() {
    return (
      <div className="App">
        <Particles className="particles" params={particleOptions} />
        <Navigation
          isSignedIn={this.state.isSignedIn}
          onRouteChange={this.onRouteChange}
        />
        {this.state.route === 'home' ? (
          <div>
            <Logo />
            <Rank />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition
              box={this.state.box}
              imageUrl={this.state.imageUrl}
            />
          </div>
        ) : this.state.route === 'signin' ? (
          <SignIn onRouteChange={this.onRouteChange} />
        ) : (
          <Register onRouteChange={this.onRouteChange} />
        )}
      </div>
    );
  }
}

export default App;

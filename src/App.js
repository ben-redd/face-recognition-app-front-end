import React from 'react';
import Particles from 'react-particles-js';
import SignIn from './components/SignIn/SignIn.component';
import Register from './components/Register/Register.component';
import Navigation from './components/Navigation/Navigation.component';
import Logo from './components/Logo/Logo.component';
import Rank from './components/Rank/Rank.component';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.component';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.component';
import './App.css';
import particleParams from './particleParams';

//parameters for the npm package react-particles-js used as a background component
const particleOptions = particleParams;

//sets up the initial state outside of the class in order to make clearing the state between users easier
const initialState = {
  input: '',
  imageUrl: '',
  box: [],
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joinDate: '',
  },
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  //used to load user information when signing in or registering
  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joinDate: data.joinDate,
      },
    });
  };

  //calculates the location of where the lines of the bounding boxes that will outline the faces in an image will be
  calculateFaceLocation = (data) => {
    const numFaces = data.outputs[0].data.regions.length;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    const boxArr = []; //array of the box locations to outline faces
    for (let i = 0; i < numFaces; i++) {
      let boundingBox =
        data.outputs[0].data.regions[i].region_info.bounding_box;
      boxArr.push({
        leftCol: boundingBox.left_col * width,
        topRow: boundingBox.top_row * height,
        rightCol: width - boundingBox.right_col * width,
        bottomRow: height - boundingBox.bottom_row * height,
      });
    }
    return boxArr;
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
  //The image is then sent as a request to the Clarifai API and we can then receive a response with information regarding face location
  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    //fetches from backend where an api call is made using the image url
    fetch('http://localhost:3000/imageurl', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: this.state.input,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response) {
          //if a response is received from the clarifai api, another call is made to our backend to increment the entry count
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: this.state.user.id,
            }),
          })
            .then((response) => response.json())
            .then((count) => {
              //updates the state of entries
              this.setState(Object.assign(this.state.user, { entries: count }));
            })
            .catch(console.log);
        }
        //updates the state of "box" to reflect the bounding box data recieved from Clarifai
        this.displayBoundingBox(this.calculateFaceLocation(response));
      })
      .catch((err) => console.log(err));
  };

  //changes the state of route
  onRouteChange = (route) => {
    if (route === 'signin') {
      this.setState(initialState);
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
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
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
          <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
        ) : (
          <Register
            onRouteChange={this.onRouteChange}
            loadUser={this.loadUser}
          />
        )}
      </div>
    );
  }
}

export default App;

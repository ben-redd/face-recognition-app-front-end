const Navigation = ({ onRouteChange, isSignedIn }) => {
  //if the user is signed in display the sign out navigation button
  if (isSignedIn) {
    return (
      <nav style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <p
          onClick={() => onRouteChange('signin')}
          className="f3 link dim black underline pa3 pointer"
        >
          Sign Out
        </p>
      </nav>
    );
    //if the user is not signed in display the Sign in and Register navigation buttons
  } else {
    return (
      <nav style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <p
          onClick={() => onRouteChange('signin')}
          className="f3 link dim black underline pa3 pointer"
        >
          Sign in
        </p>
        <p
          onClick={() => onRouteChange('register')}
          className="f3 link dim black underline pa3 pointer"
        >
          Register
        </p>
      </nav>
    );
  }
};

export default Navigation;

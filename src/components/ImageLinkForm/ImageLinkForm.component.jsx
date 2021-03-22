import './ImageLinkForm.style.css';

const ImageLinkForm = ({ onInputChange, onButtonSubmit }) => {
  return (
    <div className="mh5">
      <p className="f3">
        {'This Magic Brain will detect faces in your pictures. Give it a try.'}
      </p>
      <div className="center ">
        <div className="center pa4 br3 shadow-5 form">
          <input
            className="f4 pa2 w-70 center"
            type="text"
            onChange={onInputChange}
          />
          <button
            className="w-30 grow f4 link ph3 pv2 dib white"
            onClick={onButtonSubmit}
          >
            Detect
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageLinkForm;

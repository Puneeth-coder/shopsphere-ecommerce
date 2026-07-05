import "../styles/loader.css";

const Loader = ({ message = "Securing connection to servers..." }) => {
  return (
    <div className="loader-overlay">
      <div className="spinner-container">
        <div className="spinner-outer"></div>
        <div className="spinner-inner"></div>
      </div>
      <div className="loader-brand">
        Shop<span>Sphere</span>
      </div>
      <p className="loader-message">{message}</p>
    </div>
  );
};

export default Loader;

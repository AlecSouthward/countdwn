import './CountdownElement.css';

const CountdownElement = () => {
  return (
    <div className="element-container">
      <div className="info">
        <p>NAME</p>

        <div className="date-info">
          <p className="time-until-info">3 days until</p>
          <p>{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="progress-container">
        <div className="progress-bar" />
      </div>
    </div>
  );
};

export default CountdownElement;

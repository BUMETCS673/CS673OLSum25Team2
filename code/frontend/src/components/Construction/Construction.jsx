import './Construction.css';
const Construction = ({pageName}) => {
  return (
    <div className="under-construction">
        <div className="container">
          {/* Construction Icon */}
          <div className="construction-icon">🚧</div>

          {/* Main Heading */}
        <h1 className="main-heading">{pageName} - Under Construction</h1>

          {/* Subheading */}
          <p className="subheading">
            We're working hard to bring you something amazing! Our site is
            currently under construction, but we'll be back soon.
          </p>

          {/* Progress Bar */}
          <div className="progress-container">
            <div className="progress-bar"></div>
          </div>

          {/* Estimated Completion */}
          <p className="completion-text">
            Expected launch: <strong>Coming Soon</strong>
          </p>
        </div>
      </div>
  )
}

export default Construction
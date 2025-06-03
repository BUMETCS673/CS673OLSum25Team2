import "./Contact.css";
import MainImage from "../../assets/main_screen_image.png";
import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    setFormData({
      name: "",
      email: "",
      message: ""
    });
  };

  return (
    <section className="Contact">
      <div className="main-container contact-screen-container">
        <img src={MainImage} alt="Contact" className="contact-image" />
        <div className="contact-form-overlay">
          <h1>CONTACT US</h1>
          <h3>We'd love to hear from you!</h3>
          
          <form className="contact-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="contact-input"
            />
            
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="contact-input"
            />
            
            <textarea
              name="message"
              placeholder="Message"
              value={formData.message}
              onChange={handleChange}
              required
              className="contact-textarea"
              rows="6"
            />
            
            <button type="submit" className="contact-submit-btn">
              SEND MESSAGE
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
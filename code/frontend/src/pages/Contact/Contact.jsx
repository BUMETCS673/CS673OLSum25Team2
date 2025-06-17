import React from "react";
import "./Contact.css";

const Contact = () => {
  return (
    <section className="ContactPage">
      <div className="contact-container">
        <h2>Get in Touch!</h2>
        <p>
          We'd love to hear from you! Fill out the form or reach out directly.
        </p>
        <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            className="contact-input"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            className="contact-input"
            required
          />
          <textarea
            name="message"
            placeholder="Your Message or Feedback"
            className="contact-textarea"
            rows="5"
            required
          ></textarea>

          <button type="submit" className="contact-submit-btn">
            SEND MESSAGE
          </button>
        </form>
      </div>

      <div className="contact-container contact-info-map-section">
        <div className="contact-info">
          <h3>Contact Information</h3>
          <p>
            {" "}
            <strong>Email:</strong> support@mymagicalbedtime.com
          </p>
          <p>
            {" "}
            <strong>Phone: </strong> (617) 353-8919
          </p>
          <h4>Location: </h4>
          <p>Department of Computer Science</p>
          <p>Boston University</p>
          <p>665 Commonwealth Avenue</p>
          <p>Boston, MA 02215</p>
        </div>

        <div className="contact-map">
          <iframe
            title="BU Computer Science Department"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2946.6784770252907!2d-71.10580502313324!3d42.3498970712028!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e379f0c3a9146d%3A0x6c69a8efbd75ee29!2sDepartment%20of%20Computer%20Science!5e0!3m2!1sen!2sus!4v1749673686279!5m2!1sen!2sus"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default Contact;

import React from "react";
import "./Contact.css";
import ContactImg from "../../assets/signin_image.png";

const Contact = () => {
  return (
    <section className="ContactPage">
      {/* Left Panel */}
      <div className="contact-header">
        <h1 className="contact-h1">MY MAGICAL BEDTIME</h1>
      </div>

      {/* Right Panel */}
      <div className="contact-right">
        <div className="contact-box">
          <h2>Get in Touch</h2>
          <p>We'd love to hear from you! Fill out the form or reach out directly.</p>
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
              placeholder="Your Message"
              className="contact-textarea"
              rows="5"
              required
            ></textarea>

            <button type="submit" className="contact-submit-btn">
              SEND MESSAGE
            </button>

            {/* Backend placeholder */}
            <p className="contact-note">
              *(This form is currently a placeholder. Backend logic will be connected soon.)
            </p>
          </form>

          <div className="contact-info">
            <h3>Contact Information</h3>
            <p>Email: support@mymagicalbedtime.com</p>
            <p>Phone: (617) 353-8919</p>
            <p>Location: Department of Computer Science</p>
            <p>Boston University</p>
            <p>665 Commonwealth Avenue</p>
            <p>Boston, MA 02215</p>
          </div>

          {/* Google Map Embed */}
          <div className="contact-map-container">
            <div className="contact-map-responsive">
              <iframe
                title="BU Computer Science Department"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2949.522051418463!2d-71.10612512412729!3d42.35015953779744!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e379fb0eeb1d03%3A0x8b6ecf26b74d746a!2sBoston%20University%20Department%20of%20Computer%20Science!5e0!3m2!1sen!2sus!4v1717900902311!5m2!1sen!2sus"
                width="600"
                height="450"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Image */}
      <div className="contact-bottom-image">
        <img src={ContactImg} alt="Contact Illustration" className="contact-image" />
      </div>
    </section>
  );
};

export default Contact;
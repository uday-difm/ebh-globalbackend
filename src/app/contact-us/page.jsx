"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faLinkedin, faInstagram, faYoutube, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faLink } from "@fortawesome/free-solid-svg-icons";

export default function ContactUsPage() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    textArea: "",
  });
  const [status, setStatus] = useState({ message: '', type: '' });

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // This allows only numbers and limits the input to 10 digits
    if (/^\d*$/.test(value) && value.length <= 10) {
      setValues({ ...values, phone: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (values.phone.length !== 10) {
      setStatus({ message: "Phone number must be exactly 10 digits.", type: 'error' });
      return;
    }

    setStatus({ message: "Sending...", type: 'loading' });

    try {
      const response = await fetch(`/api/contact-us`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus({ message: "Message sent successfully!", type: 'success' });
        setValues({ name: "", email: "", phone: "", subject: "", textArea: "" });

        setTimeout(() => {
          setStatus({ message: '', type: '' });
        }, 3000);
      } else {
        setStatus({ message: `Error: ${result.message}`, type: 'error' });
      }
    } catch (error) {
      console.error("Submission Error:", error);
      setStatus({ message: "An internal server error occurred.", type: 'error' });
    }
  }

  return (
    <>
      <title>Contact Us | Earth by Humans Get in Touch With Us</title>
      <meta name="description" content=" Have questions or feedback? Contact Earth by Humans for support and inquiries. We're here to help you connect with our mission." />
      <meta name="keywords" content="contact us, get in touch, support, feedback, inquiry, phone, email, Earth by Humans, help, reach out." />
      <meta property="og:description" content=" Have questions or feedback? Contact Earth by Humans for support and inquiries. We're here to help you connect with our mission." />
      <link rel="icon" href="https://earthbyhumans.s3-eu-central-2.ionoscloud.com/statics/blog-profile-img.png" type="image/png" />
      <div>
        <section className=" bg-gradient-to-br from-white to-gray-100 text-black" id="contact w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-gradient-to-br from-white to-green-50">
          <div className="mx-auto max-w-[1350] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="mb-4">
              <div className="max-w-3xl text-center  sm:text-center  md:mx-auto md:mb-12">
                <p className="text-base font-semibold mt-10 text-black  uppercase tracking-wide text-black ">
                  Contact
                </p>
                <h2 className="font-heading m-8 font-bold tracking-tight  text-green-600 text-md sm:text-5xl">
                  Get in Touch
                </h2>
                <p className="text-justify md:text-center px-2 md:px-0">
                  We would love to hear from you! If you have any questions, comments, or suggestions, please don’t hesitate to get in touch with us. At Earth by Humans, we are committed to providing you with the best experience and serving you in the most efficient way possible.
                </p>
              </div>
            </div>
            <div className="flex items-stretch justify-center">
              <div className="grid md:grid-cols-2 gap-8 w-full">
                <div className="h-full pr-6">
                  <p className="mt-3 mb-10 text-md text-justify px-2 md:px-0">
                    You can reach out to us using the contact form below or through the contact information provided. Our dedicated support team is always ready to assist you and will strive to respond to your inquiries as quickly as possible.
                    <br />
                    <br />
                    Your feedback is invaluable to us as we continue to improve and enhance our services. Thank you for choosing Earth by Humans. We look forward to connecting with you!
                    <br /><br />
                    <b className="text-black">Published By:</b> DO IT FOR ME LLC: 30 N Gould St #24999; Sheridan, WY 82801
                  </p>
                  <div className="flex gap-4 mt-4">
                    <p className="text-lg text-gray-900">
                      <strong>Phone:</strong>
                      <a href="tel:+17863712232" className="hover:text-green-600 transition duration-300 ease-in-out"> +1-786-371-2232</a>
                    </p>
                  </div>
                  <ul className="mb-6 md:mb-0">
                    <li className="flex items-center mt-8">
                      {/* MODIFIED: The entire icon section is updated */}
                      <div className="flex items-center gap-4 text-xl text-gray-700">
                        {/* Green Link Box */}
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600 text-white">
                          <FontAwesomeIcon icon={faLink} />
                        </div>
                        {/* Social Icons */}
                        <a href="https://www.facebook.com/earthbyhumans" target="_blank" rel="noopener noreferrer" className="hover:text-green-600 transition-colors"><FontAwesomeIcon icon={faFacebookF} /></a>
                        <a href="https://www.linkedin.com/company/earth-by-humans/" target="_blank" rel="noopener noreferrer" className="hover:text-green-600 transition-colors"><FontAwesomeIcon icon={faLinkedin} /></a>
                        <a href="https://www.instagram.com/earth_by_humans/" target="_blank" rel="noopener noreferrer" className="hover:text-green-600 transition-colors"><FontAwesomeIcon icon={faInstagram} /></a>
                        {/* Added YouTube Icon */}
                        <a href="https://www.youtube.com/@earthbyhumans" target="_blank" rel="noopener noreferrer" className="hover:text-green-600 transition-colors"><FontAwesomeIcon icon={faYoutube} /></a>
                        <a href="https://twitter.com/earthbyhumans" target="_blank" rel="noopener noreferrer" className="hover:text-green-600 transition-colors"><FontAwesomeIcon icon={faTwitter} /></a>
                        <a href="mailto:info@earthbyhumans.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-600 transition-colors"><FontAwesomeIcon icon={faEnvelope} /></a>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="card h-fit max-w-6xl p-5 rounded-lg  bg-white">
                  <h2 className="mb-1 text-2xl text-blue-800 font-bold ">Contact Form</h2>
                  <p className="mb-4 text-sm text-black">Your email address will not be published. Required fields are marked *</p>
                  <form id="contactForm" onSubmit={handleSubmit}>
                    <div className="mb-6 space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <input type="text" id="name" name="name" value={values.name} required onChange={(e) => setValues({ ...values, name: e.target.value })} placeholder="Your name*" className="w-full rounded-md border border-gray-300 py-2 px-3 focus:border-green-500 focus:ring-1 focus:ring-green-500" />
                        <input type="email" id="email" name="email" value={values.email} required onChange={(e) => setValues({ ...values, email: e.target.value })} placeholder="Your email*" className="w-full rounded-md border border-gray-300 py-2 px-3 focus:border-green-500 focus:ring-1 focus:ring-green-500" />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <input id="phone" name="phone" value={values.phone} required onChange={handlePhoneChange} type="text" placeholder="Your phone number*" className="w-full rounded-md border border-gray-300 py-2 px-3 focus:border-green-500 focus:ring-1 focus:ring-green-500" />
                        <input type="text" id="subject" name="subject" value={values.subject} required onChange={(e) => setValues({ ...values, subject: e.target.value })} placeholder="Your subject*" className="w-full rounded-md border border-gray-300 py-2 px-3 focus:border-green-500 focus:ring-1 focus:ring-green-500" />
                      </div>
                      <div>
                        <textarea name="textarea" cols="30" rows="5" value={values.textArea} required onChange={(e) => setValues({ ...values, textArea: e.target.value })} id="textarea" placeholder="Write your message..." className="w-full rounded-md focus:border-green-500 focus:ring-1 focus:ring-green-500 border border-gray-300 py-2 px-3"></textarea>
                      </div>
                    </div>
                    <div className="text-center">
                      <button type="submit" className="w-full bg-green-600 hover:bg-blue-600 transition-all duration-500 text-white px-6 py-3 font-xl rounded-md">
                        {status.type === 'loading' ? 'Sending...' : 'Send Message'}
                      </button>
                      {status.message && (
                        <p className={`mt-4 text-sm font-semibold ${status.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                          {status.message}
                        </p>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
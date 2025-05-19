import React from "react";
import { FaShippingFast } from "react-icons/fa";
import { GiCycle } from "react-icons/gi";
import { MdOutlinePayments, MdVerifiedUser } from "react-icons/md";
import "./FeturedSection.css";

function FeturedSection() {
  return (
    <section className="highlights-section" aria-label="Shopping benefits">
      <div className="highlight-card">
        <div className="highlight-icon" aria-hidden="true">
          <FaShippingFast />
        </div>
        <h3 className="highlight-title">Free International Shipping</h3>
        <p className="highlight-description">
          Enjoy fast and reliable delivery worldwide.
        </p>
      </div>

      <div className="highlight-card">
        <div className="highlight-icon" aria-hidden="true">
          <GiCycle />
        </div>
        <h3 className="highlight-title">30-Day Return Policy</h3>
        <p className="highlight-description">
          Shop with confidence with our hassle-free returns.
        </p>
      </div>

      <div className="highlight-card">
        <div className="highlight-icon" aria-hidden="true">
          <MdOutlinePayments />
        </div>
        <h3 className="highlight-title">Secure Payment Options</h3>
        <p className="highlight-description">
          Your payment information is safe with us.
        </p>
      </div>

      <div className="highlight-card">
        <div className="highlight-icon" aria-hidden="true">
          <MdVerifiedUser />
        </div>
        <h3 className="highlight-title">Trusted Seller Guarantee</h3>
        <p className="highlight-description">
          We only work with verified, trusted vendors.
        </p>
      </div>
    </section>
  );
}

export default FeturedSection;
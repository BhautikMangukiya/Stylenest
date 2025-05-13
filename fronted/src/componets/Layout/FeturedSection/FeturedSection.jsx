import React from "react";
import { FaShippingFast } from "react-icons/fa";
import { GiCycle } from "react-icons/gi";
import { MdOutlinePayments, MdVerifiedUser } from "react-icons/md";
import { BiSupport } from "react-icons/bi";
import { AiOutlineGift } from "react-icons/ai";
import "./FeturedSection.css";

function FeturedSection() {
  return (
    <div className="featured-section">
      <div className="feature-1">
        <div className="icon">
          <FaShippingFast />
        </div>
        <h4>Free International Shipping</h4>
        <p>Enjoy fast and reliable delivery worldwide.</p>
      </div>

      <div className="feature-2">
        <div className="icon">
          <GiCycle />
        </div>
        <h4>30-Day Return Policy</h4>
        <p>Shop with confidence with our hassle-free returns.</p>
      </div>

      <div className="feature-3">
        <div className="icon">
          <MdOutlinePayments />
        </div>
        <h4>Secure Payment Options</h4>
        <p>Your payment information is safe with us.</p>
      </div>


      <div className="feature-4">
        <div className="icon">
          <MdVerifiedUser />
        </div>
        <h4>Trusted Seller Guarantee</h4>
        <p>We only work with verified, trusted vendors.</p>
      </div>
    </div>
  );
}

export default FeturedSection;

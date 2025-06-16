
import { FaShippingFast } from "react-icons/fa";
import { MdOutlinePayments, MdVerifiedUser } from "react-icons/md";
import { BiLeaf } from "react-icons/bi";
import "./FeturedSection.css";

function FeturedSection() {
  return (
    <div className="highlight-wrap">
      <section className="highlights-section" aria-label="Shopping benefits">
        <div className="highlight-card">
          <div className="highlight-icon" aria-hidden="true">
            <FaShippingFast />
          </div>
          <h3 className="highlight-title">Free national Shipping</h3>
          <p className="highlight-description">
            Enjoy fast and reliable delivery worldwide.
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

        <div className="highlight-card">
          <div className="highlight-icon" aria-hidden="true">
            <BiLeaf />
          </div>
          <h3 className="highlight-title">Eco-Friendly Packaging</h3>
          <p className="highlight-description">
            We use sustainable packaging for a greener planet.
          </p>
        </div>
      </section>
    </div>
  );
}

export default FeturedSection;

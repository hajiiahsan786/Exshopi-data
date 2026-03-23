import { LegalPage } from '../components/LegalPage';

export function ShippingPolicy() {
  return (
    <LegalPage title="Shipping Policy" lastUpdated="October 24, 2026">
      <h2>1. Processing Time</h2>
      <p>
        All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or 
        holidays. If we are experiencing a high volume of orders, shipments may be delayed by a few days. 
        Please allow additional days in transit for delivery. If there will be a significant delay in shipment 
        of your order, we will contact you via email or telephone.
      </p>

      <h2>2. Shipping Rates & Delivery Estimates</h2>
      <p>
        Shipping charges for your order will be calculated and displayed at checkout. We offer the following 
        shipping methods within the UAE:
      </p>
      <ul>
        <li><strong>Standard Delivery:</strong> 2-3 business days. Free for orders over AED 200. Otherwise, AED 15.</li>
        <li><strong>Express Delivery:</strong> Next business day. AED 25.</li>
        <li><strong>Same-Day Delivery:</strong> Available for orders placed before 2 PM in Dubai, Sharjah, and Abu Dhabi. AED 40.</li>
      </ul>

      <h2>3. Shipment Confirmation & Order Tracking</h2>
      <p>
        You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s). 
        The tracking number will be active within 24 hours.
      </p>

      <h2>4. Customs, Duties and Taxes</h2>
      <p>
        EXSHOPI is not responsible for any customs and taxes applied to your order. All fees imposed during or 
        after shipping are the responsibility of the customer (tariffs, taxes, etc.). For UAE orders, 5% VAT 
        is included in the product price.
      </p>

      <h2>5. Damages</h2>
      <p>
        EXSHOPI is not liable for any products damaged or lost during shipping. If you received your order damaged, 
        please contact the shipment carrier to file a claim. Please save all packaging materials and damaged goods 
        before filing a claim.
      </p>

      <h2>6. International Shipping Policy</h2>
      <p>
        We currently do not ship outside the United Arab Emirates.
      </p>
    </LegalPage>
  );
}

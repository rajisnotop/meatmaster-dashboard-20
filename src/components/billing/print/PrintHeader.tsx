import { format } from "date-fns";

interface PrintHeaderProps {
  date: Date;
}

const PrintHeader = ({ date }: PrintHeaderProps) => `
  <div class="header">
    <div class="logo-section">
      <img src="https://i.imgur.com/2IkqsVA.png" alt="Logo" class="logo">
      <div class="company-info">
        <h1 class="company-title">Neelkantha Meat Shop</h1>
        <p class="company-subtitle">Quality Meat Products</p>
      </div>
    </div>
    <div class="date-section">
      <h2 class="date-label">Sales Report</h2>
      <p class="date-value">${format(date, "MMMM dd, yyyy")}</p>
      <p class="time-value">${format(date, "hh:mm a")}</p>
    </div>
  </div>
`;

export default PrintHeader;
import axios from 'axios';
import { format } from "date-fns";

const DOCUMENT_ID = 'dIn4HugYZ0E';
const TABLE_ID = 'sua2uvkF';

// This should be stored in an environment variable in production
const CODA_API_TOKEN = 'your-coda-api-token';

export const exportToCoda = async (
  productTotals: any[],
  totalExpenses: number,
  openingBalance: number,
  cashInCounter: number,
  netAmount: number
) => {
  try {
    const url = `https://coda.io/apis/v1beta1/docs/${DOCUMENT_ID}/tables/${TABLE_ID}/rows`;
    
    // Format the date for the report title
    const reportDate = format(new Date(), 'yyyy-MM-dd');
    
    // Prepare the rows data
    const rows = productTotals.map(product => ({
      cells: [
        { column: 'Date', value: reportDate },
        { column: 'Product Name', value: product.name },
        { column: 'Quantity Sold', value: Number(product.quantity.toFixed(2)) },
        { column: 'Total Sales', value: product.amount },
        { column: 'Paid with QR', value: product.paidWithQR || 0 },
        { column: 'Unpaid to Paid', value: product.unpaid || 0 },
        { column: 'Unpaid to Paid (QR)', value: product.unpaidToPaidQR || 0 },
        { column: 'Total Expenses', value: totalExpenses },
        { column: 'Opening Balance', value: openingBalance },
        { column: 'Cash in Counter', value: cashInCounter },
        { column: 'Net Amount', value: netAmount }
      ]
    }));

    // Make POST request to add data to Coda
    const response = await axios.post(url, { rows }, {
      headers: {
        Authorization: `Bearer ${CODA_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.data) {
      throw new Error('No response from Coda API');
    }

    return response.data;
  } catch (error) {
    console.error('Error exporting to Coda:', error);
    throw error;
  }
};
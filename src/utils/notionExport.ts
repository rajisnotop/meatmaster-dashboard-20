import { format } from "date-fns";

// Replace this URL with your actual Make (Integromat) webhook URL
const MAKE_WEBHOOK_URL = 'https://hook.eu1.make.com/your-webhook-id';

export const exportToNotion = async (
  productTotals: any[],
  totalExpenses: number,
  openingBalance: number,
  cashInCounter: number,
  netAmount: number
) => {
  try {
    const data = {
      title: `Daily Sales Report - ${format(new Date(), 'yyyy-MM-dd')}`,
      productData: productTotals.map(product => ({
        name: String(product.name),
        quantity: String(product.quantity.toFixed(2)),
        amount: String(product.amount.toLocaleString()),
        paidWithQR: String((product.paidWithQR || 0).toLocaleString()),
        unpaid: String((product.unpaid || 0).toLocaleString()),
        unpaidToPaidQR: String((product.unpaidToPaidQR || 0).toLocaleString())
      })),
      summary: {
        expenses: totalExpenses.toLocaleString(),
        openingBalance: openingBalance.toLocaleString(),
        cashInCounter: cashInCounter.toLocaleString(),
        netAmount: netAmount.toLocaleString()
      }
    };

    const response = await fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to export to Notion');
    }

    return response.json();
  } catch (error) {
    console.error('Error exporting to Notion:', error);
    throw error;
  }
};
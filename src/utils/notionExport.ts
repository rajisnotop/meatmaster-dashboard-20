import { Client } from "@notionhq/client";
import { format } from "date-fns";

const notion = new Client({
  auth: 'ntn_i890264361322cPgu4MncdjNyj4owiJPcm92mjX0MJW1DP'
});

const DATABASE_ID = 'c851c31aedd749c0953b9048fa9f5a25';

export const exportToNotion = async (
  productTotals: any[],
  totalExpenses: number,
  openingBalance: number,
  cashInCounter: number,
  netAmount: number
) => {
  try {
    const response = await notion.pages.create({
      parent: {
        database_id: DATABASE_ID,
      },
      properties: {
        title: {
          title: [
            {
              text: {
                content: `Daily Sales Report - ${format(new Date(), 'yyyy-MM-dd')}`,
              },
            },
          ],
        },
      },
      children: [
        {
          object: 'block',
          type: 'table',
          table: {
            table_width: 6,
            has_column_header: true,
            has_row_header: false,
            children: [
              {
                type: 'table_row',
                table_row: {
                  cells: [
                    [{ type: 'text', text: { content: 'Product' } }],
                    [{ type: 'text', text: { content: 'Quantity Sold' } }],
                    [{ type: 'text', text: { content: 'Total Sales' } }],
                    [{ type: 'text', text: { content: 'Paid (QR)' } }],
                    [{ type: 'text', text: { content: 'Unpaid to Paid' } }],
                    [{ type: 'text', text: { content: 'Unpaid to Paid (QR)' } }],
                  ],
                },
              },
              ...productTotals.map(product => ({
                type: 'table_row',
                table_row: {
                  cells: [
                    [{ text: { content: product.name, link: null }, type: 'text' }],
                    [{ text: { content: product.quantity.toFixed(2), link: null }, type: 'text' }],
                    [{ text: { content: product.amount.toLocaleString(), link: null }, type: 'text' }],
                    [{ text: { content: (product.paidWithQR || 0).toLocaleString(), link: null }, type: 'text' }],
                    [{ text: { content: (product.unpaid || 0).toLocaleString(), link: null }, type: 'text' }],
                    [{ text: { content: (product.unpaidToPaidQR || 0).toLocaleString(), link: null }, type: 'text' }],
                  ],
                },
              })),
            ],
          },
        },
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: 'Summary' } }],
          },
        },
        {
          object: 'block',
          type: 'table',
          table: {
            table_width: 2,
            has_column_header: false,
            has_row_header: false,
            children: [
              {
                type: 'table_row',
                table_row: {
                  cells: [
                    [{ text: { content: 'Expenses', link: null }, type: 'text' }],
                    [{ text: { content: totalExpenses.toLocaleString(), link: null }, type: 'text' }],
                  ],
                },
              },
              {
                type: 'table_row',
                table_row: {
                  cells: [
                    [{ text: { content: 'Opening Balance', link: null }, type: 'text' }],
                    [{ text: { content: openingBalance.toLocaleString(), link: null }, type: 'text' }],
                  ],
                },
              },
              {
                type: 'table_row',
                table_row: {
                  cells: [
                    [{ text: { content: 'Cash in Counter', link: null }, type: 'text' }],
                    [{ text: { content: cashInCounter.toLocaleString(), link: null }, type: 'text' }],
                  ],
                },
              },
              {
                type: 'table_row',
                table_row: {
                  cells: [
                    [{ text: { content: 'Net Amount', link: null }, type: 'text' }],
                    [{ text: { content: netAmount.toLocaleString(), link: null }, type: 'text' }],
                  ],
                },
              },
            ],
          },
        },
      ],
    });

    return response;
  } catch (error) {
    console.error('Error exporting to Notion:', error);
    throw error;
  }
};
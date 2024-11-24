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
                object: 'block',
                type: 'table_row',
                table_row: {
                  cells: [
                    [{ type: "text", text: { content: 'Product' } }],
                    [{ type: "text", text: { content: 'Quantity Sold' } }],
                    [{ type: "text", text: { content: 'Total Sales' } }],
                    [{ type: "text", text: { content: 'Paid (QR)' } }],
                    [{ type: "text", text: { content: 'Unpaid to Paid' } }],
                    [{ type: "text", text: { content: 'Unpaid to Paid (QR)' } }],
                  ],
                },
              },
              ...productTotals.map(product => ({
                object: 'block',
                type: 'table_row',
                table_row: {
                  cells: [
                    [{ type: "text", text: { content: String(product.name) } }],
                    [{ type: "text", text: { content: String(product.quantity.toFixed(2)) } }],
                    [{ type: "text", text: { content: String(product.amount.toLocaleString()) } }],
                    [{ type: "text", text: { content: String((product.paidWithQR || 0).toLocaleString()) } }],
                    [{ type: "text", text: { content: String((product.unpaid || 0).toLocaleString()) } }],
                    [{ type: "text", text: { content: String((product.unpaidToPaidQR || 0).toLocaleString()) } }],
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
            rich_text: [{ type: "text", text: { content: 'Summary' } }],
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
                object: 'block',
                type: 'table_row',
                table_row: {
                  cells: [
                    [{ type: "text", text: { content: 'Expenses' } }],
                    [{ type: "text", text: { content: String(totalExpenses.toLocaleString()) } }],
                  ],
                },
              },
              {
                object: 'block',
                type: 'table_row',
                table_row: {
                  cells: [
                    [{ type: "text", text: { content: 'Opening Balance' } }],
                    [{ type: "text", text: { content: String(openingBalance.toLocaleString()) } }],
                  ],
                },
              },
              {
                object: 'block',
                type: 'table_row',
                table_row: {
                  cells: [
                    [{ type: "text", text: { content: 'Cash in Counter' } }],
                    [{ type: "text", text: { content: String(cashInCounter.toLocaleString()) } }],
                  ],
                },
              },
              {
                object: 'block',
                type: 'table_row',
                table_row: {
                  cells: [
                    [{ type: "text", text: { content: 'Net Amount' } }],
                    [{ type: "text", text: { content: String(netAmount.toLocaleString()) } }],
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
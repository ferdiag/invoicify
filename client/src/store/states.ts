export const states = {
  token: null,
  user: null,
  invoiceData: {
    customerId: '',
    products: [{ name: '', quantity: 1, price: 0, id: crypto.randomUUID() }],
    vat: 19,
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 14);
      return d.toISOString().split('T')[0];
    })(),
    netAmount: 0,
    grossAmount: 0,
  },
};

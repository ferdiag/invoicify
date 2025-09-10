// routes/invoicePdf.route.ts
import type { FastifyPluginAsync } from "fastify";
import { buildInvoicePdfStream } from "../services/invoicePdf.service";

const invoicePdfRoute: FastifyPluginAsync = async (app) => {
  app.get("/invoices/:id/pdf", async (req, reply) => {
    try {
      const { id } = req.params as { id: string };
      reply
        .type("application/pdf")
        .header("Content-Disposition", `inline; filename="invoice-${id}.pdf"`);

      const doc = await buildInvoicePdfStream(id);
      return reply.send(doc); // << keine weiteren writes/end!
    } catch (err: unknown) {
      const message =
        typeof err === "object" && err !== null && "message" in err
          ? (err as { message: string }).message
          : "PDF generation failed";
      return reply.code(404).send({ message });
    }
  });
};

export default invoicePdfRoute;

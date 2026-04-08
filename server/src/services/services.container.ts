import { loadEnv } from "@/config/env";
import { db } from "@/db/client";
import { addCustomerService } from "./addCustomer/add.customer.service";
import { addInvoiceService } from "./addInvoice/add.invoice.service";
import { deleteCustomerService } from "./delete.customer/delete.customer.service";
import { editCompanyService } from "./editCompany/edit.company.service";
import { editCustomerService } from "./editCostumer/edit.customer.service";
import { createLoginService } from "./login/login.service";
import { registerService } from "./register/register.service";

const env = loadEnv();

export { addCustomerService };
export { addInvoiceService };
export { deleteCustomerService };
export { editCompanyService };
export { editCustomerService };
export { registerService };

export const loginService = createLoginService({
  jwtSecret: env.JWT_SECRET,
  dbClient: db,
});

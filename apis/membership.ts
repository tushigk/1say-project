import { siteUrl } from "@/config/site";
import { HttpRequest } from "@/utils/request";

const appHttpRequest = new HttpRequest(null, `${siteUrl}/membership`);

export const listMembershipPlans = async () => {
  const res = await appHttpRequest.get("/plans");
  return res;
};

export const getMembershipStatus = async () => {
  const res = await appHttpRequest.get("/status");
  return res;
};

export const previewPromoCode = async (planId: string, promoCode: string) => {
  const res = await appHttpRequest.get("/promo/lookup", {
    planId,
    promoCode,
  });
  return res;
};

export const createMemberShipInvoice = async (planId: string) => {
  const payload: { planId: string } = { planId };
  return await appHttpRequest.post("/purchase", payload);
};

import { siteUrl } from "@/config/site";
import { HttpRequest } from "@/utils/request";

const appHttpRequest = new HttpRequest(null, `${siteUrl}`);

export const listBanners = async () => {
    const res = await appHttpRequest.get("/banners");
    return res;
};

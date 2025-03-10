import { API } from "..";
import { ResponseDashboardChart } from "./dashboard.chart.types";
import { ResponseDashboard } from "./dashboard.types";

export const useDashboardChart = <Res = ResponseDashboardChart>(params?: {
  companyProductID?: string;
  customerID?: string;
}) => useHttp<Res>(API.DASHBOARD.DASHBOARD, { params: { ...params } });

// export const useDashboard = <Res = ResponseDashboard>() =>
//   useHttp<Res>(API.DASHBOARD.TOTAL_TICKET_NOW, {});

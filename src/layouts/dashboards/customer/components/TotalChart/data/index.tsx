import {
  DashboardsApi,
  GetSumTicketDto,
  TicketDepartmensListDto,
  TicketDepartmentsApi,
} from "api/generated";
import getConfiguration from "confiuration";


export const fetchChartData = async (id?: string, isAllData?: boolean, isOpenTicket?: boolean, startDate?: string, endDate?: string) => {

  /*
  *Backenddeki Api ler hazır olduğunda


  * <=> *isAllData true ise tüm talep sayısı
  * <=> *isOpenTicket true ise Açık talep sayısı
   Olucak şekilde return edilecek

   *api.apiDashboardsGetUserCompanyTicketCountGet(id); =>> bu method çözülen talep dönüyor değişicek
   *api.apiDashboardsGetUserTicketCountGet(id); =>> bu method statülere göre talep dönüyor değişicek

   yerine

   *api.apiDashboardsGetUserCompanyAllTicketCountGet(id); =>> tüm talep sayısı
   *api.apiDashboardsGetUserCompanyOpenTicketCountGet(id); =>> açık talep sayısı

   şeklinde methodlar güncellenicek


  **/

  const conf = getConfiguration();
  const api = new DashboardsApi(conf);
  if (!isAllData) {
    if (id === undefined || id === null || id === "") {
      return {
        labels: [],
        datasets: {
          label: "Projects",
          backgroundColors: ["info", "primary", "dark", "secondary"],
          data: [],
        },
      };
    }
    const response = await api.apiDashboardsGetCustomerOpenCloseeGet(id, startDate, endDate);
   
    const hasTickets = response.data.some((item) => item.count > 0);

    const filteredData = response.data.filter((item) => item.count > 0);

    if (!hasTickets || filteredData.length === 0) {
      return {
        labels: ["Veri Yok"],
        datasets: {
          label: "Projects",
          backgroundColors: ["dark"],
          data: [1],
          isEmpty: true,
        },
      };
    }
    return {
      labels: response.data.map((item) => item.name),
      datasets: {
        label: "Projects",
        backgroundColors: [
          "info",
          "primary",
          "dark",
          "secondary",
          "error",
          "warning",
          "success",
          "light",
          "grey",
        ],
        data: response.data.map((item) => item.count),
      },
    };
  } else {
    if (id === undefined || id === null || id === "") {
      return {
        labels: [],
        datasets: {
          label: "Projects",
          backgroundColors: ["info", "primary", "dark", "secondary"],
          data: [],
        },
      };
    }
    const response = await api.apiDashboardsGetCustomerOpenCloseeGet(id, startDate, endDate);
    const hasTickets = response.data.some((item) => item.count > 0);
    const filteredData = response.data.filter((item) => item.count > 0);

    if (!hasTickets || filteredData.length === 0) {
      return {
        labels: ["Veri Yok"],
        datasets: {
          label: "Projects",
          backgroundColors: ["dark"],
          data: [1],
          isEmpty: true,
        },
      };
    }

    return {
      labels: response.data.map((item) => item.name),
      datasets: {
        label: "Projects",
        backgroundColors: ["info", "primary", "dark", "secondary"],
        data: response.data.map((item) => item.count),
      },
    };

  }
};

var totalChartData = {
  labels: [] as string[],
  datasets: {
    label: "Projects",
    backgroundColors: ["info", "primary", "dark", "secondary"],
    data: [] as number[],
  },
};

export default totalChartData;

import { useDashboardChart } from "@/services/dashboard";
import { Spinner } from "@heroui/react";
import { DateTime } from "luxon";
import dynamic from "next/dynamic";

type ChartData = {
  options: {
    chart: {
      id: string;
    };
    xaxis: {
      categories: string[];
    };
  };
  series: {
    name: string;
    data: number[];
  }[];
};

interface ChartLineProps {
  height?: number;
  companyProductID: string
  customerID?: string
  isB2C?: boolean
}

const ChartLine: React.FC<ChartLineProps> = ({ height, companyProductID, customerID, isB2C = false }) => {
  const Chart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
    loading: () => <Spinner />,
  });

  const [chartState, setChartState] = useState<ChartData>({
    options: {
      chart: {
        id: "",
      },
      xaxis: {
        categories: ["Mon", "Tue", "Wed", "Thr", "Fri", "Sat", "Sun"],
      },
    },
    series: [
      {
        name: "Open",
        data: [],
      },
      {
        name: "In Progress",
        data: [],
      },
      {
        name: "Resolved",
        data: [],
      },
    ],
  });

  const {
    data: dashboardChart,
    isFetching: isLoadingChart,
    isError: isErrorChart,
  } = useDashboardChart(isB2C ? {customerID: customerID} : {companyProductID: companyProductID});

  useEffect(() => {
    if (dashboardChart?.data) {
      const chartData = Object.entries(dashboardChart.data).map(
        ([, value]) => value,
      );
      const open = chartData.map((d) => d.open || 0);
      const inprogress = chartData.map((d) => d.inProgress || 0);
      const resolve = chartData.map((d) => d.resolve || 0);
      const day = chartData.map((d) =>
        d.dayName ? d.dayName.charAt(0).toUpperCase() + d.dayName.slice(1) : "",
      );

      if (day.length && open.length && inprogress.length && resolve.length) {
        setChartState((prevState) => ({
          ...prevState,
          options: {
            ...prevState.options,
            xaxis: {
              categories: day,
            },
            chart: {
              id: `Agent-data-by-day-${DateTime.now().toFormat("dd-MM-yyyy")}`,
            },
          },
          series: [
            {
              name: "Open ",
              data: open,
            },
            {
              name: "In Progress ",
              data: inprogress,
            },
            {
              name: "Resolved ",
              data: resolve,
            },
          ],
        }));
      }
    }
  }, [dashboardChart]);
  if (isErrorChart) {
    return <Spinner />;
  }

  return (
    <Chart
      aria-label="Ticket by a day of week"
      options={chartState.options}
      series={chartState.series}
      type="line"
      width="100%"
      height={height ?? 400}
    />
  );
};

export default ChartLine;

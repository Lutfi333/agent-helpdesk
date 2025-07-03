"use client";
import { Button, Card, CardBody, Pagination, Spinner } from "@heroui/react";
import { Fragment } from "react";
import dynamic from "next/dynamic";
import { DateTime } from "luxon";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import CardCustomer from "@/components/CardCustomer";
import { useCustomerList, useCustomerUserList } from "@/services/customer";
import { useDashboardChart } from "@/services/dashboard";
import PaginationComponent from "@/app/_components/pagination";
import { useAuthMe } from "@/services/auth";

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

export default function DashboardContent() {
  const Chart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
    loading: () => <Spinner />,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isFetching: isUserFetching } = useAuthMe();

  const user = useMemo(() => data?.data, [data]);

  const paginationParams = useMemo(() => {
    return {
      page: currentPage || 1,
      limit: 3,
      sort: "createdAt",
      dir: "desc",
    };
  }, [currentPage]);

  const {
    data: customer,
    isFetching,
    refetch,
  } = useCustomerUserList(paginationParams);

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

  const { data: dashboardChart } = useDashboardChart();

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

  return (
    <Fragment>
      {!isUserFetching && user?.company.type !== "B2C" && (
        <div className="mb-4">
          <h1 className="font-semibold text-xl mb-4">Our Customer</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
            {customer?.data && (
              <>
                {customer?.data.list.map((v, i) => (
                  <CardCustomer data={v} key={v.id} isFetching={isFetching} />
                ))}
              </>
            )}
          </div>
          <div className="flex justify-center items-center gap-2">
            {paginationParams && !isFetching && customer?.data && (
              <PaginationComponent
                currentPage={paginationParams?.page ?? 1}
                totalItems={customer?.data.total ?? 0}
                limit={paginationParams?.limit ?? 10}
                setCurrentPage={(value) => {
                  setCurrentPage(value);
                }}
              />
            )}
          </div>
        </div>
      )}

      <div className="mb-4 w-full">
        <Card shadow="sm">
          <CardBody>
            <p className="pl-4 text-sm">Ticket by a day of week</p>
            <Chart
              aria-label="Ticket by a day of week"
              options={chartState.options}
              series={chartState.series}
              type="line"
              width="100%"
              height={400}
            />
          </CardBody>
        </Card>
      </div>
    </Fragment>
  );
}

import InputDatePicker from "@/components/InputDatePicker";
import { useExportTicket } from "@/services/ticket";
import { parseDate } from "@internationalized/date";
import {
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import Excel from "exceljs";
import { DateTime } from "luxon";
import { Fragment, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiCheck } from "react-icons/hi";
import { Readable } from "stream";

type ExportModalProps = {
  isOpen: boolean;
  onClose: (success: boolean) => void;
  selectedStatus?: string[];
  startDate?: string;
  endDate?: string;
  sort?: string;
  dir?: string;
};

type Status = {
  id: string;
  label: string;
  color: string;
};

const statusOptions: Status[] = [
  { id: "open", label: "Open", color: "bg-green-500" },
  { id: "closed", label: "Closed", color: "bg-blue-500" },
  { id: "in_progress", label: "In Progress", color: "bg-violet-500" },
  { id: "resolve", label: "Resolve", color: "bg-orange-400" },
];

const ExportModal = (props: ExportModalProps) => {
  const [startDate, setStartDate] = useState<string>(props.startDate || "");
  const [endDate, setEndDate] = useState<string>(props.endDate || "");
  const [statusList, setStatusList] = useState<string[]>(
    props.selectedStatus || [],
  );
  const sort = props.sort || "createdAt";
  const dir = props.dir || "desc";

  useEffect(() => {
    setStartDate(props.startDate || "");
    setEndDate(props.endDate || "");
    setStatusList(props.selectedStatus || []);
  }, [props.startDate, props.endDate, props.selectedStatus]);

  const { mutate: exportData, isPending } = useExportTicket({
    startDate: startDate ? `${startDate}T00:00:00.000Z` : "",
    endDate: endDate ? `${endDate}T23:59:59.999Z` : "",
    status: statusList.join(","),
    sort,
    dir,
  });

  const handleExport = () => {
    if (!startDate || !endDate) {
      toast.error("Start date and end date are required");
      return;
    }
    exportData(
      {},
      {
        onSuccess: (data) => {
          csvToXlsx(data as string, [startDate, endDate]);
        },
        onError: (e) => {
          toast.error(e.data.message ?? "Export failed");
        },
      },
    );
  };

  const csvToXlsx = async (csv: string, range: [string, string]) => {
    const blob = new Blob([csv], { type: "text/csv" });
    const workbook = new Excel.Workbook();
    var file = new File([blob], "");
    const readableStream = file.stream();
    const nodeStream = readableStreamToNodeStream(readableStream);

    function readableStreamToNodeStream(
      readableStream: ReadableStream<Uint8Array>,
    ): NodeJS.ReadableStream {
      const reader = readableStream.getReader();
      return new Readable({
        async read() {
          const { value } = await reader.read();
          if (value) {
            this.push(Buffer.from(value));
          } else {
            this.push(null);
          }
        },
      });
    }
    const options = {
      map(value: string | Date, index: number) {
        if (index === 8 || index === 9) {
          if (value === "CreatedAt" || value === "CreatedAt\n")
            return "Created At";
          if (value.toString().startsWith("ClosedAt")) return "Closed At";
          if (!value || value.toString().trim() === "") {
            return "";
          }
          if (value.toString().endsWith("Z")) {
            const formattedDate = DateTime.fromISO(value as string).isValid
              ? DateTime.fromISO(value as string).toFormat("dd-MM-yyyy HH:mm")
              : "-";
            return formattedDate;
          }
          const dateFromSlice = DateTime.fromISO(
            value.toString().slice(0, -2) as string,
          );
          return dateFromSlice.isValid
            ? dateFromSlice.toFormat("dd-MM-yyyy hh:mm")
            : "";
        }
        return value;
      },
    };
    const worksheet = workbook.csv.read(nodeStream, options);
    (await worksheet).properties.defaultColWidth = 20;
    (await worksheet).eachRow((row, rowNumber) => {
      row.getCell(10).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      row.eachCell((cell, colNumber) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        if (cell.value != null) {
          if (rowNumber === 1) {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "C4DAD2" },
            };
            cell.font = { bold: true };
          }
        }
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob2 = new Blob([buffer], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob2);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Export_ticket_${range[0]}-${range[1]}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Export success");
  };

  const handleStatusChange = (status: string) => {
    setStatusList((prev) => {
      if (prev.includes(status)) {
        return prev.filter((item) => item !== status);
      } else {
        return [...prev, status];
      }
    });
  };

  const onReset = () => {
    setStartDate(props.startDate || "");
    setEndDate(props.endDate || "");
    setStatusList(props.selectedStatus || []);
  };

  const renderStatus = (status: Status) => (
    <Fragment key={status.id}>
      <Chip
        aria-label="status"
        onClick={() => handleStatusChange(status.id)}
        startContent={
          <div className={`mr-1 h-2 w-2 rounded-full ${status.color}`}></div>
        }
        endContent={
          statusList.includes(status.id) && (
            <div className="ml-1 h-4 w-4 rounded-full bg-green-400 flex items-center justify-center">
              <HiCheck className="h-3 w-3 text-white" />
            </div>
          )
        }
        className="capitalize"
        size="sm"
        variant="bordered"
        color={statusList.includes(status.id) ? "primary" : "default"}
      >
        {status.label}
      </Chip>
    </Fragment>
  );

  const validISODate = (date: string | null) => {
    const dt = date ? DateTime.fromISO(date) : null;
    return dt && dt.isValid ? dt.toISODate() : DateTime.now().toISODate();
  };

  return (
    <Modal
      aria-label="export-filter"
      size="xl"
      classNames={{ closeButton: "hidden" }}
      isOpen={props.isOpen}
      onClose={() => props.onClose(false)}
    >
      <ModalContent>
        <ModalHeader>Filter</ModalHeader>
        <ModalBody className="space-y-2">
          <form className="space-y-2">
            <InputDatePicker
              onValueChange={(value) => setStartDate(value)}
              maxValue={parseDate(validISODate(endDate))}
              label="Start Date"
              defaultValue={DateTime.now().toFormat("YYYY-MM-DD")}
              isRequired = {true}
              
            />
            <InputDatePicker
              onValueChange={(value) => setEndDate(value)}
              minValue={parseDate(validISODate(startDate))}
              label="End Date"
              isRequired = {true}
            />
          </form>
          <div className="my-4 flex flex-wrap justify-start gap-2">
            {statusOptions.map((status) => renderStatus(status))}
          </div>
        </ModalBody>
        <ModalFooter className="flex justify-end">
          <Button
            className="bg-white text-default-700 border-primary px-4 py-2 rounded-md"
            variant="bordered"
            onPress={() => {
              onReset();
              props.onClose(false);
            }}
          >
            Cancel
          </Button>

          <Button
            className="bg-primary text-white rounded-md"
            variant="flat"
            isLoading={isPending}
            onPress={handleExport}
          >
            Export
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ExportModal;

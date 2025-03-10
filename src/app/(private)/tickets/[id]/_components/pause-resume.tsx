import { useTimeLogs } from "@/services/ticket";
import { Button } from "@heroui/react";
import { useMemo, useState } from "react";
import { FaHistory, FaPause, FaPlay } from "react-icons/fa";
import LogTimeModal from "./log-time-modal";

type Props = {
  onPause: () => void;
  onResume: () => void;
  isPaused: boolean;
  ticketId: string;
  hidePauseResume?: boolean;
  isPending: any;
  durationTotal: number;
};
const PauseResume = (props: Props) => {
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const limit = 10;

  const isPaused = useMemo(() => props.isPaused, [props]);

  const id = useMemo(() => props.ticketId, [props.ticketId]);
  const { data: logHistory, refetch } = useTimeLogs({
    ticketId: id,
    page: currentPage,
    limit: limit,
  });

  const toggleHistory = async () => {
    await refetch();
    setIsHistoryOpen(!isHistoryOpen);
  };

  const pauseLog = useMemo(() => {
    return logHistory?.data?.list.map((item) => {
      return {
        ...item,
        pauseHistory: item.pauseHistory?.map(
          (h: { durationActive: number }) => {
            return {
              ...h,
              duration: h.durationActive || 0,
            };
          },
        ),
      };
    });
  }, [logHistory]);

  const handlePauseResume = () => {
    if (isPaused) {
      props.onResume();
    } else {
      props.onPause();
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <div className="flex gap-2">
        {!props.hidePauseResume && (
          <Button
            onPress={handlePauseResume}
            isLoading={props.isPending}
            disabled={props.isPending}
            isDisabled={props.isPending}
            className="px-4 py-2 bg-white text-slate-600 rounded-lg flex items-center gap-2"
          >
            {isPaused ? (
              <>
                <FaPlay /> Resume
              </>
            ) : (
              <>
                <FaPause /> Pause
              </>
            )}
          </Button>
        )}
        <Button
          onPress={toggleHistory}
          className="px-4 py-2 bg-white text-slate-600 rounded-lg flex items-center gap-2"
        >
          <FaHistory /> Log Time History
        </Button>
      </div>
      <LogTimeModal
        isOpen={isHistoryOpen}
        onClose={toggleHistory}
        pauseLog={pauseLog ?? []}
        logHistory={logHistory}
        currentPage={currentPage}
        limit={limit}
        durationTotal={props.durationTotal}
        handlePageChange={handlePageChange}
        handlePauseResume={handlePauseResume}
      />
    </div>
  );
};

export default PauseResume;

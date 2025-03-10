"use client";
import { secondsToHms } from "@/common/func/time";
import { ResponseListLogs } from "@/services/ticket/list.log.types";
import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { DateTime } from "luxon";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  pauseLog: any;
  logHistory: ResponseListLogs | undefined;
  currentPage: number;
  limit: number;
  durationTotal: number;
  handlePageChange: (page: number) => void;
  handlePauseResume: () => void;
};

const LogTimeModal = (props: Props) => {

  return (
    <Modal
      size="xl"
      className="max-h-[80vh]"
      // classNames={{ closeButton: "hidden" }}
      isOpen={props.isOpen}
      onClose={props.onClose}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Log Time History</ModalHeader>
            <ModalBody className="max-h-[50vh] overflow-y-auto py-0 scrollbar-hide">
              <div className="flex justify-end mx-2 py-1 sticky top-0 bg-white">
                <p>
                  Total tracked time:{" "}
                  <span className="font-bold">
                    {secondsToHms(props.durationTotal)}
                  </span>
                </p>
              </div>
              <table className="table-auto w-full">
                <tbody>
                  {Array.isArray(props.pauseLog) &&
                  props.pauseLog.length > 0 ? (
                    props.pauseLog.map((log, index) => {
                      return (
                        <tr key={log.id}>
                          <td className="p-2">
                            <div className="bg-slate-100 rounded-md p-3 font-normal">
                              <div className="flex justify-between">
                                <p className="font-bold">Log {index + 1}</p>
                                <p>
                                  Total:{" "}
                                  <span className="font-semibold text-sm">
                                    {secondsToHms(log.durationInSeconds)}
                                  </span>
                                </p>
                              </div>
                              <Divider className="my-1" />
                              <div className="flex justify-between">
                                <div>
                                  <p className="text-xs text-slate-500">
                                    Start at:
                                  </p>
                                  <div className="flex items-center space-x-1">
                                    <IoMdTime className="text-primary" />
                                    <p className="text-sm font-mono">
                                      {DateTime.fromISO(log.startAt).toFormat(
                                        "dd MMM yyyy, HH:mm:ss",
                                      )}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-xs text-slate-500">
                                    End at:
                                  </p>
                                  <div className="flex items-center space-x-1">
                                    <IoMdTime className="text-primary" />
                                    <p className="text-sm font-mono">
                                      {log.endAt
                                        ? DateTime.fromISO(log.endAt).toFormat(
                                            "dd MMM yyyy, HH:mm:ss",
                                          )
                                        : "-"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={2} className="text-center py-4">
                        No logs available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </ModalBody>
            <ModalFooter className="flex justify-between">
              <Button
                onPress={() => props.handlePageChange(props.currentPage - 1)}
                disabled={props.currentPage === 1}
                isDisabled={props.currentPage === 1}
                className="bg-primary text-white"
              >
                <FaChevronLeft className="text-lg" />
              </Button>
              <span className="self-center">
                Page {props.currentPage} / {props.logHistory?.data.totalPage}
              </span>
              <Button
                onPress={() => props.handlePageChange(props.currentPage + 1)}
                disabled={
                  props.logHistory?.data?.totalPage === undefined ||
                  props.logHistory?.data?.totalPage === 1 ||
                  props.logHistory.data.totalPage <= props.currentPage
                }
                isDisabled={
                  props.logHistory?.data?.totalPage === undefined ||
                  props.logHistory?.data?.totalPage === 1 ||
                  props.logHistory.data.totalPage <= props.currentPage
                }
                className="bg-primary text-white"
              >
                <FaChevronRight className="text-lg" />
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default LogTimeModal;

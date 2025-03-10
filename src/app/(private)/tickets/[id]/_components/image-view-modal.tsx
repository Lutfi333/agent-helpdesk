"use client";
import { Attachment } from "@/services/ticket/detail.ticket.types";
import {
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Image,
  ModalContent,
} from "@heroui/react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { pdfjs, Document, Page } from "react-pdf";
import ReactPlayer from "react-player";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

type Props = {
  isOpen: boolean;
  data: Attachment;
  onClose: () => void;
};

const ImageViewModal = (props: Props) => {
  if (typeof window !== "undefined") {
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;
  }

  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <Modal
      size={"5xl"}
      classNames={{ closeButton: "hidden" }}
      isOpen={props.isOpen}
      onClose={props.onClose}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Attachment</ModalHeader>
            <ModalBody>
              <div className="flex items-center justify-center overflow-hidden">
                {props.data.type == "document" ? (
                  <div className="w-full h-[600px] bg-slate-300 flex justify-center items-center">
                    <TransformWrapper
                      centerZoomedOut
                      limitToBounds
                      centerOnInit
                      initialScale={0.68}
                      minScale={0.5}
                    >
                      <TransformComponent
                        wrapperClass="!w-full h-[100vh] flex justify-center items-center"
                        contentClass="!w-full h-[100vh] flex justify-center items-center"
                      >
                        <Document
                          file={props.data.url}
                          onLoadSuccess={onDocumentLoadSuccess}
                        >
                          <Page pageNumber={pageNumber} />
                        </Document>
                      </TransformComponent>
                    </TransformWrapper>
                  </div>
                ) : props.data.type == "video" ? (
                  <ReactPlayer
                    url={props.data.url}
                    controls
                    width="100%"
                    height="500px"
                  />
                ) : (
                  <div className="w-full h-[500px] bg-slate-300 flex items-center justify-center">
                    <Image
                      src={props.data.url}
                      alt="Image"
                      className="rounded-none w-full h-[500px] object-contain"
                    />
                  </div>
                )}
              </div>
            </ModalBody>
            <ModalFooter className="flex justify-between">
              <div className="flex items-center">
                {props.data.type == "document" && (
                  <>
                    <Button
                      size="sm"
                      isIconOnly
                      isDisabled={pageNumber <= 1}
                      disabled={pageNumber <= 1}
                      onPress={() => {
                        if (pageNumber > 1) {
                          setPageNumber(pageNumber - 1);
                        }
                      }}
                      className="bg-primary text-white rounded-md"
                    >
                      <HiChevronLeft size={20} />
                    </Button>
                    <p className="mx-2">
                      Page {pageNumber} of {numPages}
                    </p>
                    <Button
                      size="sm"
                      isIconOnly
                      isDisabled={pageNumber >= (numPages ?? 1)}
                      disabled={pageNumber >= (numPages ?? 1)}
                      onPress={() => {
                        if (pageNumber < (numPages ?? 1)) {
                          setPageNumber(pageNumber + 1);
                        }
                      }}
                      className="bg-primary text-white rounded-md"
                    >
                      <HiChevronRight size={20} />
                    </Button>
                  </>
                )}
              </div>
              <Button
                onPress={onClose}
                className="bg-red-400 text-white rounded-md"
              >
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ImageViewModal;

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { FaClock } from "react-icons/fa";

interface AlertCreditHourModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  alertMessageL: string;
}
export default function AlertCreditHourModal(props: AlertCreditHourModalProps) {
  return (
    <Modal isOpen={props.open} onOpenChange={props.setOpen} size="sm">
      <ModalContent>
        <ModalHeader>
          <FaClock className="h-6 w-6 mr-2" />
          Alert
        </ModalHeader>
        <ModalBody>
          <p className="text-center text-lg font-semibold">{props.alertMessageL}</p>
        </ModalBody>
        <ModalFooter className="justify-center">
          <Button onPress={() => props.setOpen(false)}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

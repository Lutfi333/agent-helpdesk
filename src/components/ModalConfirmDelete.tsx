import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";

interface ModalConfirmDeleteProps {
  isOpen?: boolean;
  title?: string;
  content?: string;
  onOpenChange?: (val: boolean) => void;
  onDelete?: () => void;
}

const ModalConfirmDelete: React.FC<ModalConfirmDeleteProps> = ({
  content,
  title,
  isOpen,
  onOpenChange,
  onDelete,
}) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="justify-center">
              <h3 className="font-medium">{title || "ATTENTION"}</h3>
            </ModalHeader>
            <ModalBody>
              <p className="text-center">
                {content || "Are you sure to delete this?"}
              </p>
            </ModalBody>
            <ModalFooter className="justify-center">
              <Button variant="bordered" onPress={onClose}>
                Cancel
              </Button>
              <Button color="danger" onPress={onDelete}>
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalConfirmDelete;

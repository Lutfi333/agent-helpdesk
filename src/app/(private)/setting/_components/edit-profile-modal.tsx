import {
  Avatar,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Textarea,
} from "@heroui/react";
import { Controller } from "react-hook-form";
import { GiPhotoCamera } from "react-icons/gi";
import { TbPhotoEdit } from "react-icons/tb";

interface EditProfileModalProps {
  profileControl: any;
  handleSaveProfile: any;
  handleFileChange: any;
  inputFileRef: any;
  valueBio: string;
  setValueBio: any;
  valueContact: string;
  setValueContact: any;
  open: boolean;
  setOpen: any;
  selectedAvatar?: {
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
  } | null;
}

export default function EditProfileModal(props: EditProfileModalProps) {
  return (
    <Modal isOpen={props.open} onOpenChange={props.setOpen} size="3xl">
      <ModalContent>
        <ModalHeader>Edit Profile</ModalHeader>
        <ModalBody>
          <div>
            <form
              onSubmit={props.handleSaveProfile}
              className="flex flex-col items-center gap-3"
            >
              <div className="relative w-40 h-40 rounded-full overflow-hidden">
                <Avatar
                  src={props.selectedAvatar?.url || ""}
                  className="w-full h-full"
                />
                <div
                  role="button"
                  onClick={() => props.inputFileRef.current?.click()}
                  className="bottom-0 right-0 left-0 absolute w-full h-16 bg-black bg-opacity-70 flex items-center justify-center"
                >
                  <TbPhotoEdit className="text-white text-3xl" />
                </div>
              </div>
              <input
                className="hidden"
                accept="image/*"
                ref={props.inputFileRef}
                type="file"
                onChange={props.handleFileChange}
              />
              <Controller
                name="attachment"
                control={props.profileControl}
                render={({ field, fieldState: { error, invalid } }) => (
                  <Input
                    type="text"
                    className="hidden"
                    onClick={() => props.inputFileRef.current?.click()}
                    variant="bordered"
                    placeholder="Logo"
                    errorMessage={error?.message}
                    isInvalid={invalid}
                    {...field}
                  />
                )}
              />
              <Controller
                name="name"
                control={props.profileControl}
                rules={{
                  required: { value: true, message: "Name is required" },
                }}
                render={({ field, fieldState: { error, invalid } }) => (
                  <Input
                    type="text"
                    variant="bordered"
                    placeholder="Name"
                    errorMessage={error?.message}
                    isInvalid={invalid}
                    {...field}
                  />
                )}
              />
              <p className="font-bold">Bio</p>
              <Textarea
                type="text"
                variant="bordered"
                value={props.valueBio}
                onChange={(e) => props.setValueBio(e.target.value)}
              />
              <p className="font-bold">Contact</p>
              <Input
                type="text"
                variant="bordered"
                value={props.valueContact}
                onChange={(e) => props.setValueContact(e.target.value)}
              />
              <div className="flex gap-3">
                <Button
                  size="sm"
                  variant="bordered"
                  className="border-promary text-primary"
                  onPress={() => props.setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-primary text-white"
                >
                  Save
                </Button>
              </div>
            </form>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

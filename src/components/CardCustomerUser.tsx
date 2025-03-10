import { useDetailCompany } from "@/services/company";
import { Image } from "@heroui/react";
import { CustomerUserData } from "@/services/customer/customer.detail.types";

interface CardCustomerUserProps {
  data?: CustomerUserData;
  isDetail?: boolean;
  isFetching?: boolean;
}

const CardCustomerUser: React.FC<CardCustomerUserProps> = ({
  data,
  isDetail,
  isFetching,
}) => {
  const { data: company, refetch: refetchCompany } = useDetailCompany();

  return (
    <div className="border bg-white px-6 py-4 shadow rounded relative">
      <div className="flex gap-6 items-center">
        <div>
          {!isFetching && (
            <>
              {data?.profilePicture.url == "" ? (
                <div className="h-16 w-16 bg-gray-200 rounded-md flex items-center justify-center">
                  <span className="text-gray-500 text-lg font-semibold">
                    {data?.name[0]}
                  </span>
                </div>
              ) : (
                <Image
                  width={100}
                  height={100}
                  src={data && data?.profilePicture.url}
                  alt="Profile"
                  className="h-16 rounded-md object-cover"
                />
              )}
            </>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <p className="font-semibold text-sm">{data?.name}</p>
            <p className="text-gray-500 text-sm">{data?.email}</p>
          </div>

          <div>
            <h6 className="text-sm">Domain</h6>
            <a
              href={company?.data?.settings.domain.fullUrl}
              target="_blank"
              className=" text-sm text-primary"
            >
              {company?.data?.settings.domain.fullUrl}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardCustomerUser;

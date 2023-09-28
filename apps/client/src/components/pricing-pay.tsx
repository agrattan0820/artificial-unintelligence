"use client";

import Button from "@ai/components/button";
import { makePayment } from "@ai/utils/queries";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BiSolidCoin } from "react-icons/bi";
import Ellipsis from "./ellipsis";
import toast from "react-hot-toast";

const PricingPay = ({ email }: { email: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  const handleOnPayClick = async () => {
    setLoading(true);

    try {
      const paymentData = await makePayment({ email });

      router.push(paymentData.url);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const success = searchParams?.get("success");

    if (success) {
      toast(
        <span className="flex items-center gap-2">
          You just received a token! +1{" "}
          <span className="text-yellow-600">
            <BiSolidCoin />
          </span>
        </span>,
      );
    }
  }, [searchParams]);

  return (
    <Button
      onClick={() => handleOnPayClick()}
      disabled={loading}
      className="flex items-center gap-2"
    >
      {loading ? (
        <Ellipsis />
      ) : (
        <>
          Buy a Token{" "}
          <span>
            <BiSolidCoin />
          </span>
        </>
      )}
    </Button>
  );
};

export default PricingPay;

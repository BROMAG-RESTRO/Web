import { useEffect, useState } from "react";
import { getFooterData } from "../../helper/api/apiHelper";

function Cancelation() {
  const [footerData, setFooterData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getFooterData();
        const firstFooterData = response?.policies?.filter(
          (td) => td?.type === "refund"
        )?.[0];
        setFooterData(firstFooterData);
      } catch (error) {
        console.error("Error fetching footer data:", error);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, []);

  console.log({ footerData });

  return (
    <div className="w-screen lg:py-20 lg:px-20 px-4 py-4 flex flex-col gap-y-4 min-h-screen">
      <h1 className="font-bold text-center lg:pb-4 text-xl lg:text-4xl">
        Refund and Cancellation policy
      </h1>
      <div
        className="text-justify indent-10 leading-loose"
        dangerouslySetInnerHTML={{ __html: footerData?.content }}
      />
    </div>
  );
}

export default Cancelation;

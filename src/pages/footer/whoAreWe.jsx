import  { useEffect, useState } from "react";
import {getFooterData} from '../../helper/api/apiHelper'

function WhoAreWe() {
  const [footerData, setFooterData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getFooterData();
        setFooterData(response.data);
      } catch (error) {
        console.error("Error fetching footer data:", error);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, []);

  if (footerData === null) {
    return null;
  }

  const firstFooterData = footerData[0];

  return (
    <div className="w-screen lg:py-20 lg:px-20 px-4 py-4 flex flex-col gap-y-4 min-h-screen">
      <h1 className="font-bold text-center lg:pb-4 text-xl lg:text-4xl">Who are we</h1>
      <div
        className="text-justify indent-10 leading-loose"
        dangerouslySetInnerHTML={{ __html: firstFooterData?.content }}
      />
    </div>
  );
}

export default WhoAreWe;

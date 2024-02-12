import React, { useEffect, useState } from "react";
import TopFoods from "./TopFoods";
import Banner from "./Banner";
import TopVideos from "./TopVideos";
import NonVeg from "./NonVeg";
import CustomerReview from "./CustomerReview";
// import Fixedbanner from "./Fixedbanner";
import PlayContext from "./PlayContext";
import Advertisement from "./Advertisement";
import VegFoods from "./Veg";
import Locations from "./Locations";
import { Spin, notification } from "antd";
import { getAllfeedback, gettAllBanners } from "../../helper/api/apiHelper";
import _ from "lodash";
import LoadingScreen from "../../components/LoadingScreen";

const Home = () => {
  const [banners, setBanners] = useState([]);
  const [customerReview, setCustomerReview] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const allBanners = await gettAllBanners();
      setBanners(_.get(allBanners, "data.data", []));
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
  }, []);

  const fetchCustomerReviewData = async () => {
    try {
      const result = await getAllfeedback();
      setCustomerReview(_.get(result, "data.data", []));
    } catch (err) {}
  };

  useEffect(() => {
    fetchCustomerReviewData();
  }, []);

  return !loading ? (
    <>
      <Banner banners={banners} />
      <TopFoods topfoods={banners} />
      <TopVideos />
      <NonVeg nonVegFoods={banners} />

      <CustomerReview customerReview={customerReview} />

      <VegFoods veg={banners} />
      <div className="flex flex-col lg:gap-y-[30vh] pt-10 gap-y-10">
        {/* <Fixedbanner /> */}
        <PlayContext />
      </div>
      <Advertisement setLoading={setLoading} />
      <Locations />
    </>
  ) : (
    <LoadingScreen />
  );
};

export default Home;

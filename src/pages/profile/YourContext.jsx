/* eslint-disable no-empty */
import { useEffect, useState } from "react";
import { checkMyContestDetails } from "../../helper/api/apiHelper";
import _ from "lodash";
import { Badge, Card, Empty, Tag } from "antd";
import ProfileHeading from "../../components/ProfileHeading";
import BoxLoadingScreen from "../../components/BoxLoadingScreen";
import moment from "moment";
import { Link } from "react-router-dom";

const YourContext = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);

  const fecthData = async () => {
    try {
      setLoading(true);
      const result = await checkMyContestDetails();
      setCards(_.get(result, "data.data", []));
      console.log(_.get(result, "data.data", []));
    } catch (err) {
      setLoading(false);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fecthData();
  }, []);

  const expireStatusCheck = (res) => {
    try {
      if (!res.status) {
        return false;
      }
      if (new Date(res.expireDate) < new Date()) {
        return true;
      }
      return false;
    } catch (err) {}
  };

  return (
    <div className="profile_head">
      <div className="w-full flex items-center justify-between">
        <ProfileHeading message={" Your Contest Details"} />
        <Link to="/play-my-contest">
          <Tag className="!cursor-pointer lg:px-2 lg:py-1 bg-primary_color text-white lg:text-sm text-[10px] ">
            play now
          </Tag>
        </Link>
      </div>
      {loading ? (
        <BoxLoadingScreen loading={loading} />
      ) : _.isEmpty(cards) ? (
        <div className="center_div  w-full lg:px-2 min-h-[50vh] items-center ">
          <Empty
            description={
              <span>
                Place Online, Take Away orders, and with a stroke of luck,
                <br /> you may win and receive fantastic offers.
                {/* <Link to="/book-my-tables">
                    <span className="text-blue-500">&nbsp;here</span>
                  </Link> */}
              </span>
            }
          />
        </div>
      ) : (
        <div className="profile_cards_grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-y-3 px-2 lg:px-0">
          {cards.map((res, index) => {
            return (
              <Badge.Ribbon
                color="#DF9300"
                text={expireStatusCheck(res) && "Expired"}
                key={index}
                className={`${expireStatusCheck(res) ? "block" : "hidden"}`}
              >
                <Card
                  hoverable
                  className="!shadow-lg !cursor-default"
                  content={false}
                  cover={
                    <img
                      src="/assets/icons/success.png"
                      className={`rounded-2xl shadow-inner object-cover-cover lg:h-[200px]  ${
                        expireStatusCheck(res) ? "grayscale" : "grayscale-0"
                      }`}
                    />
                  }
                  key={index}
                >
                  <Card.Meta
                    title={`Order Id : ${res.order_id}`}
                    description={
                      <div
                        className={`!text-[12px] !text-gray-400 !shadow-lg ${
                          res.status ? "visible" : "invisible"
                        }`}
                      >
                        Expire Date :{moment(res.expireDate).format("lll")}
                      </div>
                    }
                  />
                </Card>
              </Badge.Ribbon>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default YourContext;

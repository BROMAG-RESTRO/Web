import { Avatar, Card, notification } from "antd";
import React, { useEffect, useState, memo } from "react";
import { tokenVerification } from "../../helper/api/apiHelper";
import _ from "lodash";
import { useSelector } from "react-redux";

const ProfileCard = () => {
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState([]);

  const data = useSelector((data) => {
    return data;
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const userDeails = await tokenVerification();
      setUser(_.get(userDeails, "data.data", []));
    } catch (err) {
      notification.error({ message: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [_.get(data, "auth.value", "")]);

  return (
    <Card loading={loading} className={`relative   cursor-pointer shadow `}>
      <Card.Meta
        avatar={
          !_.get(user, "[0].user_image", "") ? (
            <Avatar className="!bg-primary_color cursor-pointer">
              <div className="!uppercase">
                {_.get(user, "[0].user", "").split("")[0]}
              </div>
            </Avatar>
          ) : (
            <Avatar
              src={_.get(user, "[0].user_image", "")}
              className="!object-cover"
            />
          )
        }
        title={
          <div className="capitalize group-hover:!text-white">
            {_.get(user, "[0].user", "")}
          </div>
        }
        description={
          <div className="group-hover:!text-white">
            {_.get(user, "[0].phoneNumber", "")}
          </div>
        }
      />
    </Card>
  );
};

export default memo(ProfileCard);

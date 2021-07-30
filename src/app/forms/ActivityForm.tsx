import React, { ChangeEvent, useEffect, useState } from "react";
import { Segment } from "semantic-ui-react";
import { useStore } from "../stores/Store";
import { observer } from "mobx-react-lite";
import { Link, useHistory, useParams } from "react-router-dom";
import LoaderComponent from "../layout/LoaderComponent";
import { Activity } from "../model/activity.model";
import { Button, DatePicker, Divider, Form, Input, Space } from "antd";
import { momentOrUndefined } from "../core/utils";
import "antd/dist/antd.css";
import TextArea from "antd/lib/input/TextArea";
import moment from "moment";

export default observer(function ActivityForm() {
  const history = useHistory();
  const { activityStore } = useStore();
  const { loadActivity, loadingInitial } = activityStore;
  const { id } = useParams<{ id: string }>();
  const [activity, setActivity] = useState<Activity>({
    category: "",
    description: "",
    date: new Date(),
    city: "",
    venue: "",
    title: "",
  });

  useEffect(() => {
    if (id) {
      loadActivity(id).then((activity) => setActivity(activity!));
    }
  }, [id, loadActivity]);

  function handleSubmit() {
    if (activity.id) {
      activityStore
        .updateActivity(activity)
        .then((response) => history.push(`/activities/${response?.id}`));
    } else {
      activityStore.initiateCreateActivity(activity).then((response) => {
        if (response?.id !== undefined)
          history.push(`/activities/${response?.id}`);
      });
    }
  }
  function handleInputChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;
    setActivity({ ...activity, [name]: value });
  }

  function changeDate(date: any, dateString: string) {
    const newDate = momentOrUndefined(dateString);
    setActivity({ ...activity, ["date"]: newDate });
  }

  if (loadingInitial)
    return <LoaderComponent content={"Loading component..."} />;

  return (
    <Segment clearing>
      <Divider orientation="left">Activity details</Divider>
      <Form>
        <Form.Item>
          <Input
            placeholder="Title"
            value={activity.title}
            name="title"
            onChange={handleInputChange}
          />
        </Form.Item>

        <Form.Item>
          <TextArea
            placeholder="Description"
            name="description"
            value={activity.description}
            onChange={handleInputChange}
          />
        </Form.Item>

        <Form.Item>
          <Input
            placeholder="Category"
            name="category"
            value={activity.category}
            onChange={handleInputChange}
          />
        </Form.Item>

        <Form.Item>
          <DatePicker
            picker={"date"}
            value={moment(activity.date, "DD/MM/YYYY")}
            allowClear={true}
            format={"DD/MM/YYYY"}
            onChange={changeDate}
          />
        </Form.Item>
        <Divider orientation="left">Location details</Divider>
        <Form.Item>
          <Input
            placeholder="Venue"
            name="venue"
            value={activity.venue}
            onChange={handleInputChange}
          />
        </Form.Item>

        <Form.Item>
          <Input
            placeholder="City"
            name="city"
            value={activity.city}
            onChange={handleInputChange}
          />
        </Form.Item>
        <Space>
          <Link to={"/activities"}>
            <Button name="Cancel" shape={"round"}>
              Cancel
            </Button>
          </Link>
          <Button
            loading={activityStore.loading}
            name="Submit"
            className={"button-validation"}
            shape={"round"}
            onClick={() => handleSubmit()}
          >
            Submit
          </Button>
        </Space>
      </Form>
    </Segment>
  );
});

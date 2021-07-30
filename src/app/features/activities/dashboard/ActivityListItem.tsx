import React, { SyntheticEvent, useState } from "react";
import { Button, Icon, Item, ItemImage, Segment } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { Activity } from "../../../model/activity.model";
import { useStore } from "../../../stores/Store";
import { formatDateMonth } from "../../../core/utils";

interface Props {
  activity: Activity;
}

export default function ActivityListItem({ activity }: Props) {
  const [target, setTarget] = useState("");

  function handleDeleteActivity(
    event: SyntheticEvent<HTMLButtonElement>,
    id: string | undefined
  ) {
    setTarget(event.currentTarget.name);
    deleteActivity(id);
  }
  const { activityStore } = useStore();
  const { loading, deleteActivity } = activityStore;
  return (
    <Segment.Group>
      <Segment>
        <Item.Group>
          <Item>
            <ItemImage size={"tiny"} circular src="/static/assets/user.png" />
            <Item.Content>
              <Item.Header as={Link} to={`/activities/${activity.id}`}>
                {activity.title}
              </Item.Header>
              <Item.Description>Hosted by Fabien</Item.Description>
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <span>
          <Icon name="clock" /> {formatDateMonth(activity.date)}
          <Icon name="marker" /> {activity.venue}
        </span>
      </Segment>
      <Segment secondary>Attendees</Segment>
      <Segment clearing>
        <span>{activity.description}</span>
        <Button
          as={Link}
          to={`/activities/${activity.id}`}
          floated="right"
          content="view"
          color="teal"
        />
        <Button
          name={activity.id}
          loading={loading && target === activity.id}
          onClick={(ev) => handleDeleteActivity(ev, activity.id)}
          floated="right"
          content="delete"
          color="red"
        />
      </Segment>
    </Segment.Group>
  );
}

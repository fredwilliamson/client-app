import React, { useEffect } from "react";
import { Grid, GridColumn } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import { useStore } from "../../../stores/Store";
import { observer } from "mobx-react-lite";
import LoaderComponent from "../../../layout/LoaderComponent";
import ActivityFilters from "./ActivityFilters";

const sleep = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

export default observer(function ActivityDashBoard() {
  const { activityStore } = useStore();
  const { loadActivities, activityRegistry } = activityStore;

  useEffect(() => {
    if (activityRegistry.size <= 1) {
      sleep(1000)
        .then(() => {
          loadActivities();
        })
        .catch((error) => {
          console.log(error);
          Promise.reject(error);
        });
    }
  }, [activityRegistry.size, loadActivities]);

  if (activityStore.loadingInitial) {
    return <LoaderComponent />;
  }
  return (
    <Grid>
      <GridColumn width="10">
        <ActivityList />
      </GridColumn>
      <GridColumn width="6">
        <ActivityFilters />
      </GridColumn>
    </Grid>
  );
});

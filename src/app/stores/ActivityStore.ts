import { makeAutoObservable, observable, runInAction } from "mobx";
import { Activity } from "../model/activity.model";
import { RestApi } from "../api/RestApi";
import { ApiStatus } from "../api/ApiResult";
import {
  statusFromApiResult,
  statusFromMessages,
  ViewStatus,
  ViewStatusType,
} from "../api/statuses";
import { processViewStatus } from "../api/validation/apiValidationHelper";
import { createValidator } from "../model/validator/activity.validator";
import { formatDateMonth } from "../core/utils";

const activityApi = new RestApi<Activity>("/api/v1/activities");

export default class ActivityStore {
  activityRegistry = new Map<string, Activity>();
  selectedActivity: Activity | undefined = undefined;
  editMode = false;
  loading = false;
  loadingInitial = true;
  @observable viewStatus: ViewStatus = { status: ViewStatusType.Ok };

  constructor() {
    makeAutoObservable(this);
  }

  get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort(
      (a, b) =>
        new Date(a.date == null ? new Date() : a.date).getTime() -
        new Date(b.date == null ? new Date() : b.date).getTime()
    );
  }

  get groupedActivities() {
    return Object.entries(
      this.activitiesByDate.reduce((activities, activity) => {
        const date = formatDateMonth(activity.date);
        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity];
        return activities;
      }, {} as { [key: string]: Activity[] })
    );
  }

  loadActivities = async () => {
    try {
      const response = await activityApi.getAll();
      response.forEach((act) => {
        this.setActivity(act);
      });
      this.setLoadInitial(false);
    } catch (e) {
      console.error(e);
      this.setLoadInitial(false);
    }
  };

  setLoadInitial = (state: boolean) => {
    this.loadingInitial = state;
  };

  loadActivity = async (id: string | undefined) => {
    if (id) {
      let activity = this.getActivity(id);
      if (activity) {
        this.selectedActivity = activity;
        return activity;
      } else {
        this.loadingInitial = true;
        activity = await activityApi.get(id);
        this.setActivity(activity);
        runInAction(() => {
          this.selectedActivity = activity;
        });
        this.loadingInitial = false;
        return activity;
      }
    }
  };

  private setActivity(activity: Activity) {
    if (activity.id) {
      this.activityRegistry.set(activity.id, activity);
    }
  }

  private getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  initiateCreateActivity = async (activity: Activity) => {
    const validationMessages = createValidator().validate(activity);
    this.viewStatus = statusFromMessages(validationMessages, []);

    if (
      !processViewStatus(this.viewStatus, () =>
        this.initiateCreateActivity(activity)
      )
    ) {
      return;
    }
    return await this.createActivity(activity);
  };

  createActivity = async (activity: Activity) => {
    this.loading = true;
    const response = await activityApi.create(activity);
    this.viewStatus = statusFromApiResult(response);
    if (
      processViewStatus(
        this.viewStatus,
        (newSaveInfo) => this.createActivity(activity),
        {
          message: "Success",
          description: "Successfully saved",
        }
      )
    ) {
      if (response.status === ApiStatus.Ok) {
        return this.updateActivityStore(response);
      }
    }
  };

  updateActivity = async (activity: Activity) => {
    this.loading = true;
    const response = await activityApi.update(activity);
    if (response.status === ApiStatus.Ok) {
      return this.updateActivityStore(response);
    }
  };

  private updateActivityStore(response: {
    status: ApiStatus.Ok;
    value: Activity;
  }) {
    const updatedActivity = response.value;
    runInAction(() => {
      this.activityRegistry.set(updatedActivity.id!, updatedActivity);
      this.loading = false;
      this.editMode = false;
      this.selectedActivity = updatedActivity;
    });
    return updatedActivity;
  }

  deleteActivity = async (id: string | undefined) => {
    if (id) {
      this.loading = true;
      await activityApi.delete(id);
      runInAction(() => {
        this.activityRegistry.delete(id);
        this.loading = false;
      });
    }
  };
}

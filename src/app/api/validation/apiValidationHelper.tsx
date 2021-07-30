import React from "react";
import { notification } from "antd";
import { ApiValidationMessages } from "./ApiValidationMessages";
import { ValidationBehaviour, ValidationResult } from "./models";
import "antd/dist/antd.css";
import "./apiValidationHelper.scss";
import { Button, List } from "semantic-ui-react";
import {
  mapToValidationMessages,
  ViewStatus,
  ViewStatusType,
} from "../statuses";

const notificationKey = "ApiValidation";

export function appendValidationBehaviourParams(
  apiUrl: string,
  validationBehaviour?: ValidationBehaviour
) {
  if (!validationBehaviour) {
    return apiUrl;
  }

  const extraQueryParams: string[] = [];

  let finalUrl = apiUrl;

  if (!finalUrl.includes("?")) {
    finalUrl += "?";
  } else if (!finalUrl.endsWith("?") && !finalUrl.endsWith("&")) {
    finalUrl += "&";
  }

  if (validationBehaviour.ignoreValidationWarnings) {
    extraQueryParams.push(
      `ignoreValidationWarnings=${validationBehaviour.ignoreValidationWarnings}`
    );
  }

  return finalUrl + extraQueryParams.join("&");
}

export function processViewStatus(
  viewStatus: ViewStatus,
  onTryAgain: (validationBehaviour?: ValidationBehaviour) => void,
  successNotification?: { message: string; description: string }
): viewStatus is { status: ViewStatusType.Ok } {
  notification.close(notificationKey);

  if (viewStatus.status === ViewStatusType.Ok) {
    if (successNotification) notification.success(successNotification);

    return true;
  }

  if (viewStatus.status === ViewStatusType.ValidationErrors) {
    showNotification(false, false); // Antd should animate it the first time
  } else {
    if (viewStatus.status === ViewStatusType.UnAuthorize) {
      notification.warn({
        key: notificationKey,
        message: "Access unauthorized",
        description: "Unknown Login and password",
        duration: 0,
      });
    } else {
      notification.error({
        key: notificationKey,
        message: "Fatal error occured",
        description:
          "Something went wrong. Could you please refresh and try again? If the problem persists, please contact support.",
        duration: 0,
      });
    }
  }

  return false;

  function showNotification(withErrors: boolean, animate = true) {
    const className = !animate
      ? "initial-notif"
      : withErrors
      ? "increase-notif"
      : "decrease-notif";

    notification.info({
      key: notificationKey,
      className,
      message: "Action interrupted",
      description: (
        <NotificationContent
          showErrors={withErrors}
          viewStatus={viewStatus}
          onTryAgain={onTryAgain}
          onToggleMessages={() => showNotification(!withErrors)}
        />
      ),
      duration: 0,
    });
  }
}

export function hasBlockingIssues(
  validationResult?: ValidationResult,
  validationBehaviour?: ValidationBehaviour
): boolean {
  if (!validationResult) return true;

  return !validationBehaviour?.ignoreValidationWarnings
    ? validationResult.messages.length > 0
    : validationResult.messages.filter((m) => !m.isWarning).length > 0;
}

const NotificationContent = (props: {
  showErrors?: boolean;
  viewStatus: ViewStatus;
  onTryAgain: (validationBehaviour?: ValidationBehaviour) => void;
  onToggleMessages: () => void;
}) => {
  const result: ValidationResult =
    props.viewStatus.status === ViewStatusType.ValidationErrors
      ? props.viewStatus.validationResult
        ? props.viewStatus.validationResult
        : {
            messages: mapToValidationMessages(props.viewStatus.errors),
          }
      : { messages: [] };

  return (
    <>
      <a
        onClick={() => {
          props.onToggleMessages();
        }}
      >
        {props.showErrors ? "Hide" : "Show"} details
      </a>
      <div className="top-buffer">
        <ApiValidationMessages validationResult={result} />

        <List justify="end">
          <List.Item>
            <Button
              disabled={hasBlockingIssues(result, {
                ignoreValidationWarnings: true,
              })}
              onClick={() =>
                props.onTryAgain({ ignoreValidationWarnings: true })
              }
            >
              Ignore warnings and continue
            </Button>
          </List.Item>
        </List>
      </div>
    </>
  );
};

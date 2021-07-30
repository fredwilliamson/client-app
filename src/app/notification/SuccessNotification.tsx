import React from "react";

interface Props {
  message: string;
  description: string;
}

export default function SuccessNotification({ message, description }: Props) {
  return (
    <>
      <div className="ui positive message">
        <i className="close icon" />
        <div className="header">{message}</div>
        <p>{description}</p>
      </div>
    </>
  );
}

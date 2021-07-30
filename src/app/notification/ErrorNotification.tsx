import React from "react";

interface Props {
  message: string;
  description: string;
}

export default function ErrorNotification({ message, description }: Props) {
  return (
    <>
      <div className="ui negative message">
        <i className="close icon" />
        <div className="header">Error happens</div>
        <p>{message}</p>
        <p>{description}</p>
      </div>
    </>
  );
}

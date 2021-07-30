import React from "react";
import { Dimmer, Loader } from "semantic-ui-react";

interface Props {
  inverted?: boolean;
  content?: string;
}

export default function LoaderComponent({
  inverted = true,
  content = "Loading...",
}: Props) {
  return (
    <Dimmer active={true} inverted={inverted}>
      <Loader inverted={inverted} content={content} />
    </Dimmer>
  );
}

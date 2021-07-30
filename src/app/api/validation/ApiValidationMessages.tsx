import { WarningOutlined, StopOutlined } from "@ant-design/icons";
import { Col, List, Row } from "antd";
import React from "react";
import { ValidationResult } from "./models";
import "antd/dist/antd.css";

export const ApiValidationMessages = (props: {
  validationResult: ValidationResult;
}) => {
  const sortedMessages = props.validationResult.messages
    .slice()
    .sort((a, b) => (a === b ? 0 : a ? 1 : -1))
    .map((m) => ({
      key: m.message,
      ...m,
    }));

  return (
    <List
      size="small"
      dataSource={sortedMessages}
      renderItem={(item) => (
        <List.Item key={item.key}>
          <Row style={{ width: "100%" }}>
            <Col style={{ marginRight: "15px" }}>
              <MessageTypeIcon isWarning={!!item.isWarning} />
            </Col>

            <Col>{item.message}</Col>
          </Row>
        </List.Item>
      )}
      pagination={false}
    />
  );
};

const MessageTypeIcon = (props: { isWarning: boolean }) => {
  return props.isWarning ? (
    <div style={{ color: "#ff9400" }}>
      <WarningOutlined /> Warning
    </div>
  ) : (
    <div style={{ color: "#cc3300" }}>
      <StopOutlined /> Error
    </div>
  );
};

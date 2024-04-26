import { DescriptionsProps, Form, FormInstance, Modal, Switch } from "antd";
import { useEffect, useState } from "react";

interface SettingsValues {
  removeAds?: boolean;
  unlockVip?: boolean;
  unlockBuy?: boolean;
}

interface SettingsProps {
  initialSettings: SettingsValues;
  onFormInstanceReady: (instance: FormInstance<SettingsValues>) => void;
}

const Settings: React.FC<SettingsProps> = ({
  initialSettings,
  onFormInstanceReady,
}) => {
  const [form] = Form.useForm();
  useEffect(() => {
    onFormInstanceReady(form);
  }, []);

  return (
    <>
      <Form
        form={form}
        name="settings"
        labelAlign="right"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={initialSettings}
      >
        <Form.Item<SettingsValues> label="去除广告">
          <Form.Item name="removeAds" noStyle>
            <Switch defaultChecked />
          </Form.Item>
          <span style={{ marginLeft: 10 }}>去除网站烦人的广告</span>
        </Form.Item>

        <Form.Item<SettingsValues> label="解锁VIP">
          <Form.Item name="unlockVip" noStyle>
            <Switch defaultChecked />
          </Form.Item>
          <span style={{ marginLeft: 10 }}>可观看vip区的帖子及视频</span>
        </Form.Item>

        <Form.Item<SettingsValues> label="解锁收费视频">
          <Form.Item name="unlockBuy" noStyle>
            <Switch defaultChecked={false} disabled={true} />
          </Form.Item>
          <span style={{ marginLeft: 10 }}>可观看需要购买的视频(开发中)</span>
        </Form.Item>
      </Form>
    </>
  );
};

export default Settings;

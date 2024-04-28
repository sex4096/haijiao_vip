import { Form, FormInstance, Input, Switch } from "antd";
import { useEffect, useState } from "react";

interface SettingsValues {
  removeAds?: boolean;
  removeTops: boolean;
  unlockVip?: boolean;
  unlockBuy?: boolean;
  unlockBuyHost?: string;
}

interface SettingsProps {
  initialSettings: SettingsValues;
  onFormInstanceReady: (instance: FormInstance<SettingsValues>) => void;
}

const Settings: React.FC<SettingsProps> = ({
  initialSettings,
  onFormInstanceReady,
}) => {
  const [showSetHost, setShowSetHost] = useState(false);
  const [form] = Form.useForm();
  useEffect(() => {
    onFormInstanceReady(form);
    setShowSetHost(initialSettings.unlockBuy || false);
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
        <Form.Item<SettingsValues> label="去广告">
          <Form.Item name="removeAds" noStyle>
            <Switch />
          </Form.Item>
          <span style={{ marginLeft: 10 }}>去除网站广告</span>
        </Form.Item>

        <Form.Item<SettingsValues> label="屏蔽置顶">
          <Form.Item name="removeTops" noStyle>
            <Switch />
          </Form.Item>
          <span style={{ marginLeft: 10 }}>屏蔽全局置顶帖</span>
        </Form.Item>

        <Form.Item<SettingsValues> label="解锁VIP">
          <Form.Item name="unlockVip" noStyle>
            <Switch />
          </Form.Item>
          <span style={{ marginLeft: 10 }}>可观看vip区的帖子及视频</span>
        </Form.Item>

        <Form.Item<SettingsValues> label="解锁收费视频">
          <Form.Item name="unlockBuy" noStyle>
            <Switch onChange={setShowSetHost} />
          </Form.Item>
          <span style={{ marginLeft: 10 }}>可观看需要购买的视频</span>
        </Form.Item>

        {showSetHost && (
          <Form.Item
            label="解锁视频地址"
            name="unlockBuyHost"
            rules={[{ required: true, message: "请输入服务器地址" }]}
          >
            <Input />
          </Form.Item>
        )}
      </Form>
    </>
  );
};

export default Settings;

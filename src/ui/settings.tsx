import { Form, FormInstance, Input, Switch } from "antd";
import { useEffect, useState } from "react";

interface SettingsValues {
  removeAds?: boolean;
  removeTops: boolean;
  viewBanUser?: boolean;
  unlockVip?: boolean;
  unlockBuy?: boolean;
  host?: string;
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
  initialSettings.viewBanUser = false;
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

        <Form.Item<SettingsValues> label="查看封禁用户">
          <Form.Item name="viewBanUser" noStyle>
            <Switch disabled />
          </Form.Item>
          <span style={{ marginLeft: 10 }}>查看被封禁的用户信息(升级中)</span>
        </Form.Item>

        <Form.Item<SettingsValues> label="解锁VIP">
          <Form.Item name="unlockVip" noStyle>
            <Switch />
          </Form.Item>
          <span style={{ marginLeft: 10 }}>可观看vip区的帖子及视频</span>
        </Form.Item>

        <Form.Item<SettingsValues> label="解锁收费视频">
          <Form.Item name="unlockBuy" noStyle>
            <Switch />
          </Form.Item>
          <span style={{ marginLeft: 10 }}>可观看需要购买的视频</span>
        </Form.Item>

        <Form.Item label="服务地址">
          <Form.Item
            name="host"
            noStyle
            rules={[{ required: true, message: "请输入服务器地址" }]}
          >
            <Input />
          </Form.Item>
          <h2
            style={{
              color: "red",
              marginTop: 5,
              textAlign: "center",
            }}
          >
            请仔细阅读!!!!!
          </h2>
          <div
            style={{
              color: "red",
              marginTop: 5,
            }}
          >
            <div>服务器地址不定时更换</div>
            <div>您可以通过以下方式获取服务地址:</div>
            <div>
              1. 请订阅TG频道:
              <a href="https://t.me/svip_nav" target="_blank">
                @svip_nav
              </a>
              获取最新地址
            </div>
            <div>2. 私信我获取服务地址,不定期晚上统一回复.</div>
            <div>
              3. 通过
              <a href="https://hjcx.cc" target="_blank">
                https://hjcx.cc
              </a>
              观看,该地址不需要填写服务地址即可观看.
            </div>
          </div>
        </Form.Item>
      </Form>
    </>
  );
};

export default Settings;

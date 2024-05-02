import React, { useState } from "react";
import { FloatButton, FormInstance, Modal } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import Settings from "./settings";
import { PluginStore } from "../modules/plugin_store";

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formInstance, setFormInstance] = useState<FormInstance>();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    const values = await formInstance?.validateFields();
    onCreate(values);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onCreate = (values: any) => {
    console.log("Received values of form: ", values);

    PluginStore.set("removeAds", values.removeAds);
    PluginStore.set("removeTops", values.removeTops);
    PluginStore.set("unlockVip", values.unlockVip);
    PluginStore.set("unlockBuy", values.unlockBuy);
    PluginStore.set("viewBanUser", values.viewBanUser);

    PluginStore.set("host", values.host);
  };

  return (
    <>
      <FloatButton
        type="primary"
        tooltip="海角VIP设置"
        style={{ left: 16 }}
        icon={<SettingOutlined />}
        onClick={showModal}
      ></FloatButton>

      <Modal
        title="设置"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose={true}
        okButtonProps={{ autoFocus: true }}
      >
        <Settings
          initialSettings={{
            removeAds: PluginStore.get("removeAds", true),
            removeTops: PluginStore.get("removeTops", true),
            viewBanUser: PluginStore.get("viewBanUser", true),
            unlockVip: PluginStore.get("unlockVip", true),
            unlockBuy: PluginStore.get("unlockBuy", true),
            host: PluginStore.get("host", "https://haijiao.ku-cloud.com"),
          }}
          onFormInstanceReady={(instance) => {
            setFormInstance(instance);
          }}
        />
      </Modal>
    </>
  );
};

export default App;

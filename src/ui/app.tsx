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
    PluginStore.set("removeAds", values.removeAds);
    PluginStore.set("removeTops", values.removeTops);
    PluginStore.set("unlockVip", values.unlockVip);
    PluginStore.set("unlockBuy", values.unlockBuy);
    PluginStore.set("unlockBuyHost", values.unlockBuyHost);
  };

  return (
    <>
      <FloatButton
        type="primary"
        tooltip="海角VIP设置"
        style={{ right: 16 }}
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
            unlockVip: PluginStore.get("unlockVip", true),
            unlockBuy: PluginStore.get("unlockBuy", false),
            unlockBuyHost: PluginStore.get("unlockBuyHost", ""),
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

import React, { useEffect, useState } from "react";
import { FloatButton, FormInstance, Modal } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import Settings from "./settings";
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
    console.log(values);
    GM_setValue("removeAds", values.removeAds);
    GM_setValue("removeTops", values.removeTops);
    GM_setValue("unlockVip", values.unlockVip);
    GM_setValue("unlockBuy", values.unlockBuy);
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
            removeAds: GM_getValue("removeAds", true),
            removeTops: GM_getValue("removeTops", true),
            unlockVip: GM_getValue("unlockVip", true),
            unlockBuy: GM_getValue("unlockBuy", false),
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

import { Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
export default function MyButton() {
  return (
    <Button type="primary" icon={<SearchOutlined />}>
      插件设置
    </Button>
  );
}

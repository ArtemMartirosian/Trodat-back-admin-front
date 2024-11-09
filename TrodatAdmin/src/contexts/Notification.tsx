import {createContext} from "react";
import {NotificationArgsProps} from "antd";

type NotificationPlacement = NotificationArgsProps['placement'];

export default createContext({ name: 'Default' });
import { Option } from './option';

export interface SettingsBrowse {
  include_preorders: string;
  include_in_theaters: string;
  channelList: string;
  options: Option[];
}

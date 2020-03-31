export interface SettingsBrowse {
  settings: {
    id: number;
    user_id: number;
    channel: string;
    sources: string;
    platform: string;
    include_preorders: string;
    include_in_theaters: string;
    type: string;
  };
}

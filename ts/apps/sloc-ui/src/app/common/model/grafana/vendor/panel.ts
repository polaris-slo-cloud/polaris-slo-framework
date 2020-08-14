import { PanelModel } from '@grafana/data';

export interface Panel extends PanelModel {
    title: string;
    description: string;
}

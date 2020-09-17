import { KubeConfig } from "@kubernetes/client-node";
import { SloApplicationController } from './app/controller';

const k8sConfig = new KubeConfig();
k8sConfig.loadFromDefault();

const controller = new SloApplicationController();
controller.run(k8sConfig);

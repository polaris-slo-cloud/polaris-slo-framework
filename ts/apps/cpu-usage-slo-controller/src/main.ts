import { KubeConfig } from "@kubernetes/client-node";
import { SloMappingController } from './app/controller';

const k8sConfig = new KubeConfig();
k8sConfig.loadFromDefault();

const controller = new SloMappingController();
controller.run(k8sConfig);

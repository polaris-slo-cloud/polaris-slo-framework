import { PolarisTransformationService } from '../../transformation';
import { ObjectKindWatcher } from './object-kind-watcher';
import { OrchestratorClient } from './orchestrator-client';
import { WatchManager } from './watch-manager';

/**
 * Provides facilities for creating orchestrator clients, watches, and object transformation.
 */
export interface OrchestratorGateway {

    /**
     * The {@link PolarisTransformationService} that should be used for converting between orchestrator-independent Polaris objects
     * and orchestrator-specific plain objects, which can be serialized.
     */
    transformer: PolarisTransformationService;

    /**
     * Creates an `ObjectKindWatcher` specific to this runtime implementation.
     */
    createObjectKindWatcher(): ObjectKindWatcher;

    /**
     * Creates a new `WatchManager` for watching multiple `ObjectKinds`.
     */
    createWatchManager(): WatchManager;

    /**
     * Creates a new `OrchestratorClient` for performing CRUD operations on orchestrator objects.
     */
    createOrchestratorClient(): OrchestratorClient;

}

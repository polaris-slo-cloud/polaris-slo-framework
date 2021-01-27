# Project Structure

The SLOC project consists of the following components:

* Orchestrator-independent SLO Script core library (`@sloc/core`)
* Orchestrator-specific SLO Script connectors (currently `@sloc/kubernetes`)
* SLO Script metrics query API connectors (currently `@sloc/prometheus`)
* Generic SLO mappings and controllers
* Generic elasticity strategy controllers

The elasticity strategy controllers are currently realized in Go, whereas the other components are realized in TypeScript.

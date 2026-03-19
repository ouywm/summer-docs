---
title: "opentelemetry Plugin"
description: "How to use the opentelemetry plugin"
---


OpenTelemetry is a full-dimensional observability solution that integrates logs, metrics, and tracing.

## A brief history of OpenTelemetry

* In 2010, The [Dapper](https://research.google/pubs/dapper-a-large-scale-distributed-systems-tracing-infrastructure/) paper released by Google marked the beginning of distributed link tracing.
* In 2012, Twitter open-sourced [Zipkin](https://zipkin.io/).
* In 2015, Uber released the open-source version of [Jaeger](https://www.jaegertracing.io/). Currently, Zipkin and Jaeger are still one of the most popular distributed link tracing tools.
* In 2015, the [OpenTracing](https://opentracing.io/) project was accepted by [CNCF](https://www.cncf.io/) as its third hosted project, dedicated to standardizing distributed link tracing across components.
* In 2017, Google open-sourced its internal Census project, and then [OpenCensus](https://opencensus.io/) became popular in the community.
* In 2017, W3C started to develop [TraceContext](https://github.com/w3c/trace-context) related standards.
* In early 2019, two existing open source projects: OpenTracing and OpenCensus were announced to be merged into the [OpenTelemetry](https://opentelemetry.io/) project, and Log and Metrics were merged.
* In 2021, OpenTelemetry released V1.0.0, which provided stability guarantees for the client's link tracing part.
* 2023 is a milestone for OpenTelemetry, because its three basic signals, link tracing, metrics and logs, have all reached [stable versions](https://opentelemetry.io/status/).
* In 2024, [OpenTelemetry v1.3.0](https://github.com/open-telemetry/opentelemetry-proto/releases/tag/v1.3.0) was released, adding [profiling signals](https://opentelemetry.io/blog/2024/state-profiling/). In June of the same year, Elastic donated an EBPf-based [profiler agent](https://github.com/open-telemetry/opentelemetry-ebpf-profiler).

> [CNCF](https://landscape.cncf.io/?group=projects-and-products&view-mode=card&license=oss&classify=category&sort-by=stars&sort-direction=desc#observability-and-analysis--observability) has many observability backend implementations available for use.


<div class="doc-badge-row">
<a href="https://crates.io/crates/summer-opentelemetry"><img src="https://img.shields.io/crates/v/summer-opentelemetry.svg" alt="crates.io"/></a>
<a href="https://docs.rs/summer-opentelemetry"><img src="https://docs.rs/summer-opentelemetry/badge.svg" alt="Documentation"/></a>
</div>

## Dependencies

```toml
summer-opentelemetry = "<version>"
```

OTEL uses the [W3C format](https://github.com/w3c/trace-context) to propagate context information for tracing by default.

Optional features:
* `jaeger`: Use [jaeger format](https://www.jaegertracing.io/docs/1.18/client-libraries/#propagation-format) to propagate context
* `zipkin`: Use [zipkin format](https://github.com/openzipkin/b3-propagation) to propagate context
* `more-resource`: Add more resource information, such as host Host, operating system, process information

## Configuration

```toml
[opentelemetry]
enable = false    # Whether to enable the plugin at runtime
```

For other configurations, it is recommended to use the environment variables in the OTEL specification. For details, please refer to the OpenTelemetry SDK documentation:

* [SDK Configuration](https://opentelemetry.io/docs/languages/sdk-configuration/)
* [Environment Variable Specification](https://opentelemetry.io/docs/specs/otel/configuration/sdk-environment-variables/)

For complete code, refer to [`opentelemetry-example`](https://github.com/summer-rs/summer-rs/tree/master/examples/opentelemetry-example)

**Note**: [opentelemetry-rust](https://github.com/open-telemetry/opentelemetry-rust/issues/1678) is not stable yet, and some features of [tracing](https://github.com/open-telemetry/opentelemetry-rust/issues/1571) need to be integrated. The plugin will continue to track the relevant dynamics of opentelemetry-rust and tracing, and update them in a timely manner.

---
title: "opentelemetry插件"
description: "opentelemetry插件如何使用"
---


# opentelemetry插件

OpenTelemetry是一个集log、metrics、tracing于一体的全维度可观测性方案

## OpenTelemetry简史

* 2010年 Google发布的 [Dapper](https://research.google/pubs/dapper-a-large-scale-distributed-systems-tracing-infrastructure/) 论文是分布式链路追踪的开端
* 2012年 Twitter 开源了 [Zipkin](https://zipkin.io/)。
* 2015年 Uber 发布了 [Jaeger](https://www.jaegertracing.io/) 的开源版本。目前 Zipkin 和 Jaeger 仍然是最流行的分布式链路追踪工具之一。
* 2015年 [OpenTracing](https://opentracing.io/) 项目被 [CNCF](https://www.cncf.io/) 接受为它的第三个托管项目，致力于标准化跨组件的分布式链路追踪。
* 2017年 Google 将内部的 Census 项目开源，随后 [OpenCensus](https://opencensus.io/) 在社区中流行起来。
* 2017年 W3C 着手制定 [TraceContext](https://github.com/w3c/trace-context) 相关标准。
* 2019年初，两个现有开源项目：OpenTracing 和 OpenCensus 被宣布合并为 [OpenTelemetry](https://opentelemetry.io/) 项目，并将Log和Metrics整合进观测性标准。
* 2021年， OpenTelemetry 发布了V1.0.0，为客户端的链路追踪部分提供了稳定性保证。
* 2023年对于 OpenTelemetry 来说是一个里程碑，因为其三个基本信号，链路追踪、指标和日志，都达到了[稳定版本](https://opentelemetry.io/status/)。
* 2024年 [OpenTelemetry v1.3.0](https://github.com/open-telemetry/opentelemetry-proto/releases/tag/v1.3.0)发布，新增[Profiling信号](https://opentelemetry.io/blog/2024/state-profiling/)，同年6月Elastic捐赠了基于ebpf的[profiler agent](https://github.com/open-telemetry/opentelemetry-ebpf-profiler)。

> [CNCF](https://landscape.cncf.io/?group=projects-and-products&view-mode=card&license=oss&classify=category&sort-by=stars&sort-direction=desc#observability-and-analysis--observability)已有众多可观测性后端实现可供使用。


<div class="doc-badge-row">
<a href="https://crates.io/crates/summer-opentelemetry"><img src="https://img.shields.io/crates/v/summer-opentelemetry.svg" alt="crates.io"/></a>
<a href="https://docs.rs/summer-opentelemetry"><img src="https://docs.rs/summer-opentelemetry/badge.svg" alt="Documentation"/></a>
</div>

## 依赖

```toml
summer-opentelemetry = "<version>"
```

OTEL默认使用[W3C格式](https://github.com/w3c/trace-context)传递链路追踪的上下文信息。

可选的features: 
* `jaeger`: 使用[jaeger格式](https://www.jaegertracing.io/docs/1.18/client-libraries/#propagation-format)透传上下文
* `zipkin`: 使用[zipkin格式](https://github.com/openzipkin/b3-propagation)透传上下文
* `more-resource`: 添加更多的资源信息，如主机Host、操作系统、进程信息

## 配置

```toml
[opentelemetry]
enable = false    # 运行时是否启用该插件
```

其他配置推荐使用OTEL规范中的环境变量，具体请参阅OpenTelemetry SDK文档：

* [SDK Configuration](https://opentelemetry.io/docs/languages/sdk-configuration/)
* [Environment Variable Specification](https://opentelemetry.io/docs/specs/otel/configuration/sdk-environment-variables/)

完整代码参考[`opentelemetry-example`](https://github.com/summer-rs/summer-rs/tree/master/examples/opentelemetry-example)

**注意**: [opentelemetry-rust](https://github.com/open-telemetry/opentelemetry-rust/issues/1678)尚未稳定，与[tracing](https://github.com/open-telemetry/opentelemetry-rust/issues/1571)的部分功能需要整合。插件会持续跟踪opentelemetry-rust和tracing的相关动态，并及时更新。

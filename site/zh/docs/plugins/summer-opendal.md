---
title: "summer-opendal插件"
description: "opendal插件如何使用"
---


OpenDAL 提供了统一的数据访问层, 可以方便的访问各种存储系统。

<img style="width:100%" src="https://opendal.apache.org/img/external/e90fb803e25e12f621eafa3d092fe628.png" alt="OpenDAL"/>


<div class="doc-badge-row">
<a href="https://crates.io/crates/summer-opendal"><img src="https://img.shields.io/crates/v/summer-opendal.svg" alt="crates.io"/></a>
<a href="https://docs.rs/summer-opendal"><img src="https://docs.rs/summer-opendal/badge.svg" alt="Documentation"/></a>
</div>

## 依赖

```toml
summer-opendal = { version = "<version>" }
```

## 配置

```toml
[opendal]
scheme = "fs"                # OpenDAL支持的服务
options = { root = "/tmp" }  # 服务配置项，不同的scheme有不同的配置项
layers = []                  # Layer是拦截操作的机制
```

Layer的相关配置, 可参看[这个文档](https://docs.rs/opendal/latest/opendal/layers/index.html)

## Components

配置完以上配置项后，插件会自动注册一个 [`Op`](https://docs.rs/summer-opendal/latest/summer_opendal/type.Op.html) 客户端。该对象是 [`opendal::Operator`](https://docs.rs/opendal/latest/opendal/struct.Operator.html) 的别名。

```rust
pub type Op = Operator;
```

完整示例代码，参考 [`summer-opendal-example`](https://github.com/summer-rs/summer-rs/tree/master/examples/summer-opendal-example)

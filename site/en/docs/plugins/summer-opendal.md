---
title: "summer-opendal Plugin"
description: "How to use the opendal plugin"
---


OpenDAL offers a unified data access layer, empowering users to seamlessly and efficiently retrieve data from diverse storage services.

<img style="width:100%" src="https://opendal.apache.org/img/external/e90fb803e25e12f621eafa3d092fe628.png" alt="OpenDAL"/>


<div class="doc-badge-row">
<a href="https://crates.io/crates/summer-opendal"><img src="https://img.shields.io/crates/v/summer-opendal.svg" alt="crates.io"/></a>
<a href="https://docs.rs/summer-opendal"><img src="https://docs.rs/summer-opendal/badge.svg" alt="Documentation"/></a>
</div>

## Dependencies

```toml
summer-opendal = { version = "<version>" }
```

## Configuration items

```toml
[opendal]
scheme = "fs"                # service that OpenDAL supports
options = { root = "/tmp" }  # service options. Different options for different scheme
layers = []                  # Layer is the mechanism to intercept operations.
```

For Layer configuration, see [this document](https://docs.rs/opendal/latest/opendal/layers/index.html)

## Components

After configuring the above configuration items, the plugin will automatically register a [`Op`](https://docs.rs/summer-opendal/latest/summer_opendal/type.Op.html) client. This object is an alias of [`opendal::Operator`](https://docs.rs/opendal/latest/opendal/struct.Operator.html).

```rust
pub type Op = Operator;
```

For the complete code, please refer to [`summer-opendal-example`](https://github.com/summer-rs/summer-rs/tree/master/examples/summer-opendal-example)

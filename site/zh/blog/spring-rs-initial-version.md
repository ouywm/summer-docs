---
title: "summer-rs初始版本发布"
description: "经过一个月的迭代，我用 Rust 编写了一个设计思路接近 Spring Boot 的应用框架。下面是一个最简单的 Web 应用例子"
---


# summer-rs初始版本发布

> 发布时间: 2024-08-04

经过一个月的迭代，我用 Rust 编写了一个设计思路接近 Spring Boot 的应用框架。下面是一个最简单的 Web 应用例子

```rust
use summer::{route, get, App};
use summer_web::{
    extractor::Path, handler::TypeRouter, response::IntoResponse, 
    Router, WebConfigurator, WebPlugin,
};

#[auto_config(WebConfigurator)]
#[tokio::main]
async fn main() {
    App::new()
        .add_plugin(WebPlugin)
        .run()
        .await
}

#[get("/")]
async fn hello_world() -> impl IntoResponse {
    "hello world"
}

#[route("/hello/{name}", method = "GET", method = "POST")]
async fn hello(Path(name): Path<String>) -> impl IntoResponse {
    format!("hello {name}")
}
```

`summer-rs`使用插件的方式整合了Rust生态中流行的几个框架，并提供了过程宏来简化开发。

对`summer-rs`感兴趣的可以[点击这里](/zh/docs/getting-started/quick-start/)快速上手。

---
title: "Quick Start"
description: "A page introducing how to quickly get started with summer-rs"
---


On this page, I will introduce how to quickly get started with summer-rs

## Prepare the environment

* rust ≥ 1.75

## Add dependencies

Add the following dependencies to your `Cargo.toml` file

```toml
[dependencies]
# summer provides the core plugin system and useful Procedural Macros
summer = "<version>"
# If you are going to write a web application, add summer-web
summer-web = "<version>"
# If the application needs to interact with the database, add summer-sqlx
summer-sqlx = { version="<version>", features = ["mysql"] }
# The summer-rs project uses the tokio asynchronous runtime by default
tokio = "1"
```

## Write code

```rust
```rust
use anyhow::Context;
use summer::{auto_config, App};
use summer_sqlx::{
    sqlx::{self, Row},
    ConnectPool, SqlxPlugin,
};
use summer_web::{
    axum::response::IntoResponse,
    error::Result,
    extractor::{Component, Path},
    WebConfigurator, WebPlugin,
};
use summer_web::{get, route};

// Main function entry
#[auto_config(WebConfigurator)] // auto config web router
#[tokio::main]
async fn main() {
    App::new()
        .add_plugin(SqlxPlugin) // Add plug-in
        .add_plugin(WebPlugin)
        .run()
        .await
}

// The get macro specifies the Http Method and request path.
// summer-rs also provides other standard http method macros such as post, delete, patch, etc.
#[get("/")]
async fn hello_world() -> impl IntoResponse {
    "hello world"
}

// You can also use the route macro to specify the Http Method and request path.
// Path extracts parameters from the HTTP request path
#[route("/hello/{name}", method = "GET", method = "POST")]
async fn hello(Path(name): Path<String>) -> impl IntoResponse {
    format!("hello {name}")
}

// Component can extract the connection pool registered by the SqlxPlugin in AppState
#[get("/version")]
async fn sqlx_request_handler(Component(pool): Component<ConnectPool>) -> Result<String> {
    let version = sqlx::query("select version() as version")
        .fetch_one(&pool)
        .await
        .context("sqlx query failed")?
        .get("version");
    Ok(version)
}
```
```

## Configure the application

Create a `config` directory in the root path of the project, where the `summer-rs` configuration files will be stored.

You can first create an `app.toml` file in this directory with the following content:

```toml
[web]
port = 8000 # Configure the web service port. If not configured, the default port is 8080

[sqlx] # Configure the database connection information of sqlx
uri = "mysql://user:password@127.0.0.1:3306"
```

`summer-rs` supports multiple environment configurations: dev (development), test (testing), and prod (production), corresponding to the three configuration files `app-dev.toml`, `app-test.toml`, and `app-prod.toml`. The configuration in the environment configuration file will override the configuration items of the `app.toml` main configuration file.

`summer-rs` will activate the configuration file of the corresponding environment according to the `summer_ENV` environment variable.

## Run

Coding is complete, please make sure your database can be connected normally, then let's start running.

```sh
cargo run
```

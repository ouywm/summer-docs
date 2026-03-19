---
title: "summer-stream Plugin"
description: "How to use summer-stream plugin"
---


# summer-stream Plugin

summer-stream is based on <a href='https://github.com/SeaQL/sea-streamer' target='_blank'>sea-streamer</a>

<div class="doc-badge-row">
<a href="https://crates.io/crates/summer-stream"><img src="https://img.shields.io/crates/v/summer-stream.svg" alt="crates.io"/></a>
<a href="https://docs.rs/summer-stream"><img src="https://docs.rs/summer-stream/badge.svg" alt="Documentation"/></a>
</div>

## Dependencies

```toml
summer-stream = { version = "<version>", features=["file"] }
```

summer-stream supports four message storages: `file`, `stdio`, `redis`, and `kafka`.

optional features: `json`.

## Configuration items

```toml
[stream]
uri = "file://./stream"   # StreamerUri data stream address
```

StreamUri supports file, stdio, redis, and kafka. For the format of uri, please refer to [StreamerUri](https://docs.rs/sea-streamer/latest/sea_streamer/struct.StreamerUri.html).

* stdio is suitable for command line projects.
* file is suitable for stand-alone deployment projects.
* redis is suitable for distributed deployment projects. Redis5.0 provides stream data structure, so the redis version is required to be greater than 5.0. For details, please refer to [redis stream official documentation](https://redis.io/docs/latest/develop/data-types/streams/).
* Kafka is suitable for distributed deployment projects with larger message volumes. Kafka can be replaced with [redpanda](https://github.com/redpanda-data/redpanda), which is a high-performance message middleware written in C++ and compatible with the kafka protocol. It can completely get rid of the JVM that Kafka relies on.

### Detailed stream configuration
```toml
# File stream configuration
[stream.file]
connect = { create_file = "CreateIfNotExists" }

# Standard stream configuration
[stream.stdio]
connect = { loopback = false }

# Redis stream configuration
[stream.redis]
connect = { db=0,username="user",password="passwd" }

# Kafka stream configuration
[stream.kafka]
connect = { sasl_options={mechanism="Plain",username="user",password="passwd"}}
```

### Send message

`StreamPlugin` registers a `Producer` for sending messages. If you need to send messages in json format, you need to add the `json` feature in the dependencies:

```toml
summer-stream = { version = "0.1.1", features=["file","json"] }
```

```rust linenos
```rust
use anyhow::Context;
use serde_json::json;
use summer::{auto_config, App};
use summer_stream::{Producer, StreamPlugin};
use summer_web::error::Result;
use summer_web::get;
use summer_web::{
    axum::response::{IntoResponse, Json},
    extractor::Component,
    WebConfigurator, WebPlugin,
};
use std::time::SystemTime;

#[auto_config(WebConfigurator)]
#[tokio::main]
async fn main() {
    App::new()
        .add_plugin(StreamPlugin)
        .add_plugin(WebPlugin)
        .run()
        .await
}

#[get("/")]
async fn send_msg(Component(producer): Component<Producer>) -> Result<impl IntoResponse> {
    let now = SystemTime::now();
    let json = json!({
        "success": true,
        "msg": format!("This message was sent at {:?}", now),
    });
    let resp = producer
        .send_json("topic", json)
        .await
        .context("send msg failed")?;

    let seq = resp.sequence();
    Ok(Json(json!({"seq":seq})))
}
```
```

### Consume messages

`summer-stream` provides a process macro called `stream_listener` to subscribe to messages from a specified topic. The code is as follows:

```rust linenos
```rust
use summer::tracing;
use summer::App;
use summer_stream::consumer::Consumers;
use summer_stream::extractor::Json;
use summer_stream::file::AutoStreamReset;
use summer_stream::handler::TypedConsumer;
use summer_stream::stream_listener;
use summer_stream::{file::FileConsumerOptions, StreamConfigurator, StreamPlugin};
use stream_file_example::Payload;

#[tokio::main]
async fn main() {
    App::new()
        .add_plugin(StreamPlugin)
        .add_consumer(consumers())
        .run()
        .await
}

fn consumers() -> Consumers {
    Consumers::new().typed_consumer(listen_topic_do_something)
}

#[stream_listener(
    "topic",
    "topic2",
    file_consumer_options = fill_file_consumer_options
)]
async fn listen_topic_do_something(Json(payload): Json<Payload>) {
    tracing::info!("{:#?}", payload);
}

fn fill_file_consumer_options(opts: &mut FileConsumerOptions) {
    opts.set_auto_stream_reset(AutoStreamReset::Earliest);
}
```
``` 

View the complete example code [stream-file-example](https://github.com/summer-rs/summer-rs/tree/master/examples/stream-file-example), [stream-redis-example](https://github.com/summer-rs/summer-rs/tree/master/examples/stream-redis-example), [stream-kafka-example](https://github.com/summer-rs/summer-rs/tree/master/examples/stream-kafka-example)

## Read configuration

You can use [`Config`](https://docs.rs/summer-stream/latest/summer_stream/extractor/struct.Config.html) to extract the configuration in toml. The usage is exactly the same as [`summer-web`](/docs/plugins/summer-web/#read-configuration).

```rust
#[derive(Debug, Configurable, Deserialize)]
#[config_prefix = "custom"]
struct CustomConfig {
    a: u32,
    b: bool,
}

#[stream_listener("topic")]
async fn use_toml_config(Config(conf): Config<CustomConfig>) -> impl IntoResponse {
    format!("a={}, b={}", conf.a, conf.b)
}
```

Add the corresponding configuration to your configuration file:

```toml
[custom]
a = 1
b = true
```

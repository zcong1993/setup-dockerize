# Setup Dockerize

Setup [dockerize](https://github.com/jwilder/dockerize) tools for you.

## Getting Started

Simple usage:

```yaml
- name: Setup dockerize
  uses: zcong1993/setup-dockerize@v1.1.0
  # will use 0.6.1
```

Use a specific version:

```yaml
- name: Setup dockerize
  uses: zcong1993/setup-dockerize@v1.1.0
  with:
    dockerize-version: '0.6.0'
```

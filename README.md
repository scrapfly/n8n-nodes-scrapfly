# n8n-nodes-scrapfly

This is an n8n community node. It lets you use ScrapFly in your n8n workflows. [n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[ScrapFly.io](https://scrapfly.io/) provides data collection APIs for web page scraping, screenshots, and AI data extraction at scale. Integrating ScrapFly within a workflow enables extracting web page sources, parsing for structured data, or taking screenshots as binary files.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation. See examples
from [Scrapfly documentation](https://scrapfly.io/docs/integration/n8n) to see usage.

## Operations
- __Scrape web page URLs__  
Scrapes the HTML source of a given web page URL with the support of headless browsers, proxies, and Unblocker anti-bot bypass.
- __Extract Data From an HTML, Text, or Markdown Document Using AI__  
Automatically parse HTML, Text, or Markdown documents using pre-defined templates or LLM prompts to extract structured data.
- __Capture web page screenshot__  
Takes a screenshot of a web page as an image file given its URL.
- __Get account info__  
Get information about the current account subscription and its usage.

## Credentials

ScrapFly API key is used as a credential key. To get your API key, register for free.

## Usage

For example, regarding usage and predefined workflow templates, please look at [ScrapFly's n8n integration docs](https://scrapfly.io/docs/integration/n8n).

### Proxy Pool

The __Proxy Pool__ field of the __Scrape Web Page__ and __Scrape API Request__ operations sets
both the proxy network and the Unblocker (anti-bot bypass):

* __Basic__: datacenter proxies, Unblocker off.
* __Unblocker__: residential proxies with the Unblocker.
* __Unblocker Ultra__: residential proxies with the Unblocker, the only pool accepted by the
  targets and anti-bot protections that have a price of their own. They refuse __Basic__ and
  __Unblocker__ with `ERR::PROXY::UNBLOCKER_ULTRA_REQUIRED` (HTTP 422, not billed).
* __Auto__: the API picks the pool before the request, from the target's profile: the
  Unblocker on datacenter proxies, or the pool the target needs. Accepted on every target, the
  ones that require __Unblocker Ultra__ included, where their price is added. Priced as the
  pool it runs on.

__Capture Web Page Screenshot__ takes the same four pools in its own __Proxy Pool__ field; a
screenshot costs the same on every pool.

### Deprecated: Unblocker (Legacy) and Anti-Scraping Protection (Legacy)

The __Unblocker (Legacy)__ and __Anti-Scraping Protection (Legacy)__ checkboxes are deprecated:
use __Proxy Pool__ (__Unblocker Ultra__ for the Unblocker). The
[migration guide](https://scrapfly.io/new-pricing#legacy-spellings) covers the requests written
before the proxy pools, the pools __Public Datacenter Pool (Legacy)__ and
__Public Residential Pool (Legacy)__ included.

New nodes (node version 2) no longer show the checkboxes; a node saved before keeps node
version 1 and shows them. Once a node's __Proxy Pool__ is __Basic__, __Unblocker__,
__Unblocker Ultra__ or __Auto__, the checkboxes are ignored: the pool decides the Unblocker
alone.

A node saved before version 0.1.10 stored the __Unblocker (Legacy)__ checkbox under its former
name, __Anti-Scraping Protection__ (`asp`). Version 0.1.10 dropped that key when loading the
workflow, so such a node ran with the Unblocker off. From 0.1.11, version 1 nodes declare it
again, as __Anti-Scraping Protection (Legacy)__, so the node sends a stored `asp` value, which
wins over __Unblocker (Legacy)__ when both are set. A workflow re-saved under 0.1.10 may have
lost the key: set __Proxy Pool__ to __Unblocker Ultra__ to turn the Unblocker back on.

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [ScrapFly documentation](https://scrapfly.io/docs)

## Development 

To publish a new release, you need repo access and play command like `make bump-version VERSION=0.1.3`
